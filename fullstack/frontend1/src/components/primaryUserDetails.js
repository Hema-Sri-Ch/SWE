import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ListGroup from 'react-bootstrap/ListGroup';


export default function UserDetails (){
    const [details, setDetails] = useState({});
    const {id} = useParams();

    const getUserDetails = async() => {
        try {
            const response = await fetch(`http://localhost:5000/userdetails/${id}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                setDetails(data);
            })

            console.log(details);
        } catch (error) {
            console.error("Error fetching message:", error);
        }
    }

    useEffect(() => {
        getUserDetails();
    }, []);
    
    
    if(details.batch === "AD") return(
        <div>
            <Paper
                sx={{
                    p: 2,
                    margin: 'auto',
                    flexGrow: 1,
                    backgroundColor: '#1A2027',
                }}
                >
            <Box sx={{ flexGrow: 1 }}>
            <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={8}>
                    <ListGroup>
                        <ListGroup.Item>User ID:  {details.user_id} </ListGroup.Item>
                        <ListGroup.Item>User Name: {details.user_name}</ListGroup.Item>
                    </ListGroup>
                </Grid>

            </Grid>
            </Box>
            </Paper>
        </div>
    );

    else if(details.batch === "FA") return (
        <div>
            <Paper
                sx={{
                    p: 2,
                    margin: 'auto',
                    flexGrow: 1,
                    backgroundColor: '#1A2027',
                }}
                >
            <Box sx={{ flexGrow: 1 }}>
            <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={8}>
                    <ListGroup>
                        <ListGroup.Item>User ID:  {details.user_id} </ListGroup.Item>
                        <ListGroup.Item>User Name: {details.user_name}</ListGroup.Item>
                        <ListGroup.Item>Departement: {details.department}</ListGroup.Item>
                        <ListGroup.Item>Qualifications: {details.qualification}</ListGroup.Item>
                    </ListGroup>
                </Grid>

            </Grid>
            </Box>
            </Paper>
        </div>
    );

    else if(details.batch) return(
        <div>
            <Paper
                sx={{
                    p: 2,
                    margin: 'auto',
                    flexGrow: 1,
                    backgroundColor: '#1A2027',
                }}
                >
            <Box sx={{ flexGrow: 1 }}>
            <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={8}>
                    <ListGroup>
                        <ListGroup.Item>User ID:  {details.user_id} </ListGroup.Item>
                        <ListGroup.Item>User Name: {details.user_name}</ListGroup.Item>
                        <ListGroup.Item>Semeseter: {details.semester}</ListGroup.Item>
                        <ListGroup.Item>Departement: {details.department}</ListGroup.Item>
                        <ListGroup.Item>Batch: {details.batch}</ListGroup.Item>
                    </ListGroup>
                </Grid>

            </Grid>
            </Box>
            </Paper>
        </div>
    );

    else return(
        <div>
            No user
        </div>
    );
}