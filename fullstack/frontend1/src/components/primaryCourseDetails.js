import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ListGroup from 'react-bootstrap/ListGroup';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));



function CourseDetails() {
    const [details, setDetails] = useState({});
    const {cid} = useParams();

    const getCourseDetails = async() => {
        try {
            const response = await fetch(`http://localhost:5000/coursedetails/${cid}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                data.start_time = new Date(data.start_time).toLocaleDateString();
                data.end_time = new Date(data.end_time).toLocaleDateString();
                setDetails(data);
            })
        } catch (error) {
            console.error("Error fetching message:", error);
        }
    }

    useEffect(() => {
        getCourseDetails();
    }, []);
    return(
        <div>
            <h1> Course Details </h1>
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
                <Grid item xs={16}>
                <Item><h2>{details.course_id}: {details.course_name}</h2></Item>
                
                </Grid>
                <Grid item xs={4}>
                <Item>
                    <h2>Course Description</h2>
                    {details.course_description}
                </Item>
                </Grid>
                <Grid item xs={4}>
                <Item>
                    <h2>Course Syllabus</h2>
                    {details.course_syllabus}
                </Item>
                </Grid>
                <Grid item xs={8}>
                <Item>
                <ListGroup>
                    <ListGroup.Item>instructor: {details.instructor_id}: {details.instructor_name}</ListGroup.Item>
                    <ListGroup.Item>timings: START={details.start_time}; END={details.end_time}</ListGroup.Item>
                    {details.prereq_cids && details.prereq_cids.length > 0 && (
                        <ListGroup.Item>Prerequisite courses: {details.prereq_cids.join(', ')}</ListGroup.Item>
                    )}
                    {details.eligible_batches && details.eligible_batches.length > 0 && (
                        <ListGroup.Item>Eligible Batches: {details.eligible_batches.join(', ')}</ListGroup.Item>
                    )}
                    <ListGroup.Item>Slot: {details.slot}</ListGroup.Item>
                    <ListGroup.Item>Room: {details.room}</ListGroup.Item>
                    <ListGroup.Item>Credits: {details.credits}</ListGroup.Item>
                    <ListGroup.Item>Max Students: {details.max_students}</ListGroup.Item>
                </ListGroup>
                </Item>
                </Grid>
            </Grid>
            </Box>
            </Paper>
        </div>
    );
}

export default CourseDetails;