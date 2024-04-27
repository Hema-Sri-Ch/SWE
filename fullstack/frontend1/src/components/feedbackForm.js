import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import InputLabel from "@mui/material";


export default function FeedbackForm({cid}) {

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({});

    const getFeedbackForm = async()=> {
        try {
            const response = await fetch(`http://localhost:5000/feedbackforms1/${cid}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            })
            const data = await response.json();
            setForm(data);
            console.log(form);
        } catch (error) {
            console.error("Error on fetching", error);
        }
    }

    useEffect(() => {
        getFeedbackForm();
    }, [cid]);

    return (
        <div>

        </div>
    );
}