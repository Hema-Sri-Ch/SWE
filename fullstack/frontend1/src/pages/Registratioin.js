import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ActiveCourses from "../components/activeCourses";
import CourseA from "../components/courseA";
import AvailableCourses from "../components/avilableCourses";

export default function Registration() {
    const [cid, setCid] = useState(null);

    const updateCid = (newCid) => {
        setCid(newCid);
    }

    const usertype = 2;
    return (
        <div>
            <Container>
                <Row>
                    <Col md={6}>
                        <AvailableCourses cid={cid} updateCid={updateCid} />
                    </Col>

                    <Col md={6}>
                        <CourseA cid={cid} usertype={usertype}/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}