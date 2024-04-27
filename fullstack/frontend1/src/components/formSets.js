import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function FormSets({fid, updateFid}) {
    const [formsets, setFormsets] = useState([]);

    const getFormsets = async () => {
        try {
            const response = await fetch('http://localhost:5000/feedbackforms', {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            // Assuming setCourses is a state setter function from useState hook
            setFormsets(data);
            console.log(data); // This will print the fetched data
            // This may not immediately reflect the updated state due to its asynchronous nature
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    }

    useEffect(() => {
        getFormsets();
    }, []);

    const handleClick = (newFid) => {
        updateFid(newFid);
    };

    console.log("forms", fid);

    return(
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {formsets.map((formset, index) => (
                <div key={index} style={{ margin: '10px' }}>
                    <Card  style={{ width: '18rem', display: 'inline-block' }}>
                
                    <Card.Body>
                        <Card.Title>Form Set ID: {formset.id}</Card.Title>
                        <Card.Text >
                            Set Name: {formset.name} 
                        </Card.Text>
                        <Button variant="primary"onClick={() => handleClick(formset.id)} >View Form</Button>
                    </Card.Body>
                    </Card>
                </div>
            ))}
                
        </div>
    )
}