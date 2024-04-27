import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

function MessageList() {
    const [msgs, setMsgs] = useState([]);
    const [pending, setPending] = useState(true);
    const navigate = useNavigate();

    const getMessages = async() => {
        try {
            const response = await fetch('http://localhost:5000/receivedmessages/CS21BTECH11013', {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                user_type: 2
                //body: JSON.stringify({ "id": "CS21BTECH11013" })
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                //data.time = new Date(data.time).toLocaleString();
                setMsgs(data);
                setPending(false);
                console.log(data);
                // console.log(data, msg);
            });
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    useEffect(() => {
        getMessages();
    }, []);

    const columns = [
        {
            name: "id",
            selector: (row) => row.msg_id,
            sortable: true
        },
        {
            name: "From",
            selector: (row) => row.user_id,
            sortable: true
        },
        {
            name: "Subject",
            selector: (row) => row.msg_head,
            sortable: true
        },
        {
            name: "Time",
            selector: (row) => row.time,
            sortable: true
        }
    ];

    const handleRowClick = (row) => {
        // Navigate to the detail page for the clicked message
        navigate(`/message/${row.msg_id}`);
    };

    return (
        <div>
            <DataTable 
                title="Messages"
                noHeader
                columns={columns}
                data={msgs}
                progressPending={pending}
                defaultSortFieldId="time"
                pagination
                highlightOnHover
                pointerOnHover
                onRowClicked={handleRowClick}
            />
        </div>
    );
}

export default MessageList;
