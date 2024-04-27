import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { InputLabel, MenuItem, Select } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CourseA({cid, usertype}){
    const [details, setDetails] = useState(null);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null);
    const [reg, setReg] = useState(null);

    const getCourseDetails = async () => {
        try {
            if(cid){
                const response = await fetch(`http://localhost:5000/coursedetails/${cid}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"}
                })

                const data = await response.json();
                setDetails(data);
            }
        } catch (error) {
            console.error("Error on fetching", error);
        }
    }

    const id = 'CS21BTECH11013';
    const bid = 'CS21BTECH';
    const [regCourses, setRegCourses] = useState([]);
    const getRegCourses = async() => {
        try {
            if(usertype === 2){
                const response = await fetch(`http://localhost:5000/registeredcourses/${id}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"}
                })

                const data = await response.json();
                setRegCourses(data);
            }
        } catch (error) {
            console.error("Error on fetching", error);
        }
    }

    const setRegDeregbutton = async() => {
        await getRegCourses();

        setReg(true);
        regCourses.map((crs) => {
            if (crs.course_id === cid) {
                setReg(false);
            } 
        });
        console.log(regCourses);
    }

    useEffect(() => {
        getCourseDetails();
        setRegDeregbutton();
    }, [cid]);

    const handleClickOpen= () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    


    const handleDeRegister = async() => {
        try {
            const body = {id, cid};
            console.log(JSON.stringify(body));

            const response = await fetch(`http://localhost:5000/deregistercourse`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            const data = await response.json();
            console.log(data);
            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    }
    
    if(usertype === 0) return(
        <div style={{ overflowX: 'auto' }}>
            {JSON.stringify(details)}
        </div>
    );

    else if(usertype === 2) return(
        <div style={{ overflowX: 'auto' }}>
            <div>{JSON.stringify(details)}</div>
            {reg ? (
                <Button onClick={handleClickOpen}>
                Register
                </Button>
            ) : (
                <Button onClick={handleDeRegister}>
                Deregister
                </Button>
            )}
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                component: 'form',
                onSubmit:async (event) => {
                    event.preventDefault();
                    try {
                        const body = {id, cid, bid, type};
                        console.log(JSON.stringify(body));

                        const response = await fetch(`http://localhost:5000/registercourse`, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify(body)
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text(); // Assuming the response is plain text
                        })
                        .then(data => {
                            console.log(data); // Log the response data to see what it contains
                            // Handle the response data here
                        })

                    } catch (error) {
                        console.error("Error on updation: ",  error);
                    }
                    handleClose();
                },
                }}
            >
                <DialogTitle>Elective Type</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select Elective Type
                    </DialogContentText>

                    <InputLabel key='type' id='demo-simple-select-label'>elective type</InputLabel>

                    <Select
                        key='elective'
                        value={type}
                        onChange={(e) => (setType(e.target.value))}
                        fullWidth
                    >
                        <MenuItem value="elective_A"> elective A</MenuItem>
                        <MenuItem value="elective_B"> elective B</MenuItem>
                        <MenuItem value="elective_C"> elective C</MenuItem>
                        <MenuItem value="elective_D"> elective D</MenuItem>
                    </Select>
                
                </DialogContent>

                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}