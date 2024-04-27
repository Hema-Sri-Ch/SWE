import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from 'react-bootstrap/Card';

function MessageBox() {
    const [msg, setMsg] = useState({});
    const { msg_id } = useParams();

    const getMessage = async () => {
        try {
            const response = await fetch(`http://localhost:5000/message/${msg_id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                data.time = new Date(data.time).toLocaleString();
                setMsg(data);
                // console.log(data, msg);
            });
        } catch (error) {
            console.error("Error fetching message:", error);
        }

    }


    useEffect(() => {
        getMessage();
    }, []);

   
    return (
        <div>
            <h1> MESSAGE </h1>

            <Card style={{ width: '18rem' }}>
                <Card.Header>From: {msg.user_id}</Card.Header>
                <Card.Body>
                    <Card.Title>{msg.msg_head}</Card.Title>
                    <Card.Text>{msg.message}</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">{msg.time}</Card.Footer>
            </Card>
        </div>
    );
}

export default MessageBox;
