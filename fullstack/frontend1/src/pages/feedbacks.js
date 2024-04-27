import React, { useState } from "react";
import AvailableCourses from "../components/avilableCourses";
import { Col, Container } from "react-bootstrap";
import FeedbackForm from "../components/feedbackForm";

export default function Feedbacks() {
    const [cid, setCid] = useState(null);

    const updateCid = (newCid) => {
        setCid(newCid);
    }
    return (
        <div>
            <Container>
                <Col ms={6}>
                    <AvailableCourses cid={cid} updateCid={updateCid}/>
                </Col>
                <Col ms={6}>
                    <FeedbackForm cid={cid}/>
                </Col>
            </Container>
        </div>
    );
}