import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormSets from "../components/formSets";
import Form from "../components/form";

export default function Forms() {
    const [fid, setFid] = useState(null);

    const updateFid = (newFid) => {
        setFid(newFid);
    };

    useEffect(() => {
        console.log('bid is updating to ', {fid});
    }, [fid]);

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <h1> ONE </h1>
                        <FormSets fid={fid} updateFid={updateFid}/>
                    </Col>
                    <Col>
                        <h1> TWO </h1>
                        <Form fid={fid}/>
                        
                    </Col>
                </Row>
            </Container>
        </div>
    )
}