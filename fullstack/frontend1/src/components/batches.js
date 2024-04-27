import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function Batches({bid, updateBid}) {
    const [batches, setBatches] = useState([]);

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

    useEffect(() => {
        getBatches();
    }, []);

    const handleClick = (newBid) => {
        updateBid(newBid);
    };

    console.log("batches", bid);

    return(
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {batches.map((batch, index) => (
                <div key={index} style={{ margin: '10px' }}>
                    <Card  style={{ width: '18rem', display: 'inline-block' }}>
                
                    <Card.Body>
                        <Card.Title>Batch ID: {batch.batch_id}</Card.Title>
                        <Card.Text >
                            <div>Department: {batch.department} </div>
                            <div>Year: {batch.year}</div>
                            
                            {batch.batch}
                        </Card.Text>
                        <Button variant="primary"onClick={() => handleClick(batch.batch_id)} >View Users</Button>
                    </Card.Body>
                    </Card>
                </div>
            ))}
                
        </div>
    )
}