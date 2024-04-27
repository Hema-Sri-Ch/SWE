import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Batches from "../components/batches";
import UserList from "../components/userList";


export default function Users() {
    const [bid, setBid] = useState("AD");

    const updateBid = (newBid) => {
        setBid(newBid);
    };

    useEffect(() => {
        console.log('bid is updating to ', {bid});
    }, [bid]);

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <h1> ONE </h1>
                        <Batches bid={bid} updateBid={updateBid} />
                    </Col>
                    <Col>
                        <h1> TWO </h1>
                        <UserList bid={bid} />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}