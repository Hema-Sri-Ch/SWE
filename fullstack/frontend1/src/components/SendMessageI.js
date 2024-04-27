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

export default function SendMessage() {
  const [open, setOpen] = React.useState(false);
  const [courses, setCourses] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [cid, setCid] = React.useState(null);
  const [text, setText] = React.useState(null);
  const [id, setID] = React.useState("FA001");

  const getCourses = async () => {
    try {
        const response = await fetch('http://localhost:5000/courses/FA001', {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        // Assuming setCourses is a state setter function from useState hook
        setCourses(data);
        console.log(data); // This will print the fetched data
        console.log(courses); // This may not immediately reflect the updated state due to its asynchronous nature
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}
//   React.useEffect(() => {
//     getCourses();
//   }, []);

  const handleClickOpen = () => {
    setOpen(true);
    getCourses();
    console.log(courses.course_id);
  };

  const handleClose = () => {
    setOpen(false);
    setCid(null);
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
               const body = {id, cid, text, title};
               console.log(JSON.stringify(body));

               const response = await fetch(`http://localhost:5000/instructormessage`, {
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
                <InputLabel id="demo-simple-select-label">Course batch</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cid}
                label="Course"
                onChange={(event) => {
                    setCid(event.target.value);
                }}
                >
                {courses.map((course) => (
                    <MenuItem
                        key = {course}
                        value = {course.course_id}
                    >
                        {course.course_id}: {course.course_name}
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
