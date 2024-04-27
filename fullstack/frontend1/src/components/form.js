import React, { useEffect, useState } from "react";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";

export default function Form({fid}) {

    const [form, setForm] = useState(1);

    const getForm = async() => {
        if(fid){
            try {
                const response = await fetch(`http://localhost:5000/feedbackforms2/${fid}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"}
                })
                const data = await response.json();
                setForm(data);
            } catch (error) {
                console.error("Error on fetching: ", error);
            }
        }
    }

    useEffect(() => {
        getForm();
    }, [fid]);

    return(
        <div>
            <h2> Details of the form of id: {form.id}; Name: {form.set_name} </h2>
            <ListGroupItem>{form.q1}</ListGroupItem>
            <ListGroupItem>{form.q2}</ListGroupItem>
            <ListGroupItem>{form.q3}</ListGroupItem>
            <ListGroupItem>{form.q4}</ListGroupItem>
            <ListGroupItem>{form.q5}</ListGroupItem>

            <ListGroupItem>{form.q6}</ListGroupItem>
            <ListGroupItem>{form.q7}</ListGroupItem>
            <ListGroupItem>{form.q8}</ListGroupItem>
            <ListGroupItem>{form.q9}</ListGroupItem>
            <ListGroupItem>{form.q10}</ListGroupItem>
        </div>
    );
}