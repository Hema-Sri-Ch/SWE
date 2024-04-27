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

export default function GradeForm() {
    const [open, setOpen] = React.useState(false);
    const [students, setStudnets] = React.useState([]);
    const [grades, setGrades] = React.useState([]);
    const [newgrades, setNewgrades] = React.useState([]);
    const {cid} = useParams();

    const getEnrolledStudents = async() => {
        try {
            const response = await fetch(`http://localhost:5000/enrolledstudents/${cid}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
            const data = await response.json();
            setStudnets(data);
            setNewgrades(new Array(data.length).fill(''));
            
        } catch (err) {
            console.error("Error in Fetching: ", err);
        }
    }

    const getGrades = async() => {
      try {
          const response = await fetch(`http://localhost:5000/grades`, {
              method: "GET",
              headers: {"Content-Type": "application/json"},
          })
          const data = await response.json();
          setGrades(data);
      } catch (error) {
          console.error("Error in fetching: ", error);
      }
    }

    React.useEffect(() => {
        getEnrolledStudents();
        getGrades();
    }, []);
 

    const handleGradeChange = (index, grade) => {
      const newNewGrades = [...newgrades];
      newNewGrades[index] = grade;
      setNewgrades(newNewGrades);
    }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Grade Students
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit:async (event) => {
            event.preventDefault();
            const id = 'FA001';
            const mygrades = newgrades.map((grade, index) => ({
              grade: grade,
              id: students[index].student_id
            }));
            try {
              
              const body = {id, cid, mygrades}
              console.log(JSON.stringify(body));

              const response = await fetch(`http://localhost:5000/handlegrades`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
              })

              console.log(response);

            } catch (error) {
              console.error("Error on updation: ",  error);
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>Grade Students</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Enter the Grades of all the students before entering submitting
            </DialogContentText>

            {students.map((student, index) => (
              <div >
                <InputLabel key={'a'+student.student_id} id="demo-simple-select-label">{student.student_id}</InputLabel>
                <Select 
                key={student.student_id}
                labelId={`grade-label-${index}`}
                id={`grade-select-${index}`}
                value={newgrades[index]}
                onChange={(e) => handleGradeChange(index, e.target.value)}
                label="Grade"
                fullWidth
                
                >
                
                    {grades.map((grade) => (
                      <MenuItem
                        key = {grade.grade}
                        value = {grade.grade}
                      >
                        {grade.grade}
                      </MenuItem>
                    ))}
            
                </Select>
              </div>
            ))}
        
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Send</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
