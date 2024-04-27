import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Form from 'react-bootstrap/Form';

export default function SendMessageA() {
  const [open, setOpen] = React.useState(false);
  const [batches, setBatches] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [bid, setBid] = React.useState(null);
  const [text, setText] = React.useState(null);
  const [id, setID] = React.useState("AD01");

  const getBatches = async () => {
    try {
        const response = await fetch('http://localhost:5000/batches', {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        // Assuming setCourses is a state setter function from useState hook
        setBatches(data);
        console.log(data); // This will print the fetched data
        // This may not immediately reflect the updated state due to its asynchronous nature
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}
//   React.useEffect(() => {
//     getCourses();
//   }, []);

  const handleClickOpen = () => {
    setOpen(true);
    getBatches();
  };

  const handleClose = () => {
    setOpen(false);
    setBid(null);
    setTitle(null);
    setText(null);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Send a message
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit:async (event) => {
            event.preventDefault();
            try {
               const body = {id, bid, text, title};
               console.log(JSON.stringify(body));

               const response = await fetch(`http://localhost:5000/adminmessage`, {
                method: "POST",
                headers:{ "Content-Type": "application/json"},
                body: JSON.stringify(body)
               })
               console.log(response);
            } catch (err) {
                console.error(err.message);
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>Send Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the message to be sent and click on send
          </DialogContentText>
          
           <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Batch</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={bid}
                label="Batch"
                onChange={(event) => {
                    setBid(event.target.value);
                }}
                >
                {batches.map((batch) => (
                    <MenuItem
                        key = {batch}
                        value = {batch.batch_id}
                    >
                        {batch.batch_id}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Box>

        <TextField
            fullWidth
            id="outlined-controlled"
            label="Subject"
            value={title}
            onChange={(event) => {
                setTitle(event.target.value);
            }}
        />


        <Form.Group aria-required className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Message Text</Form.Label>
            <Form.Control as="textarea" rows={3} value={text} onChange={(event) => {
                setText(event.target.value)
            }} />
        </Form.Group>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Send</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
