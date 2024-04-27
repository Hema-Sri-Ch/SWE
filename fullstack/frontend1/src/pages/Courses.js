import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ActiveCourses from "../components/activeCourses";
import DeactiveCourses from "../components/deactiveCourses";
import CourseA from "../components/courseA";
import AddCourse from "../components/addCourse";


export default function CoursesA() {
    const [cid, setCid] = useState(null);

    const updateCid = (newCid) => {
        setCid(newCid);
    };

    const usertype = 0;

    return (
        <div>
            <Container>
                <Row>
                    <Col md={6}>
                        <Row>
                        <h1> Active Courses List </h1>
                        <ActiveCourses cid={cid} updateCid={updateCid}/>
                        </Row>
                        <Row>
                        <h1> Deactive Courses List </h1>
                        <DeactiveCourses cid={cid} updateCid={updateCid} />
                        </Row>
                    </Col>
                    <Col md={6}>
                        <h1>Course Details</h1>
                        <CourseA cid={cid} usertype={usertype}/>
                    </Col>
                </Row>
                <AddCourse />
            </Container>
        </div>
    );
}