import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from 'react-bootstrap';


export default function AvailableCourses({cid, updateCid}) {

    const [courses, setCourses] = useState([]);
    const [pending, setPending] = useState(true);
    const [dcids, setDcids] = useState([]);

    const getAvaliableCourses = async() => {
        try {
            const response = await fetch(`http://localhost:5000/activecourses`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            })
            const data = await response.json();
            setCourses(data);
            setPending(false);
        } catch (error) {
            console.error("Error on fetching,, ", error);
        }
    }

    useEffect(() => {
        getAvaliableCourses();
    }, []);

    const handleRowClick = (row) => {
        updateCid(row.course_id);
    };

      
    const columns = [
        {
            name: "ID",
            selector: (row) => row.course_id,
            sortable: true
        },
        {
            name: "Name",
            selector: (row) => row.course_name,
            sortable: true
        },
        {
            name: "Instructor",
            selector: (row) => row.instructor_name,
            sortable: true
        },
        {
            name: "start_time",
            selector: (row) => row.start_time,
            sortable: true
        },
        {
            name: "end time",
            selector: (row) => row.end_time,
            sortable: true
        },
        {
            name: "Credits",
            selector: (row) => row.credits,
            sortable: true
        },
        {
            name: "Slot",
            selector: (row) => row.slot,
            sortable: true
        },
        {
            name: "Room",
            selector: (row) => row.room,
            sortable: false
        }
    ];

    return(
        <div>
            <div style={{ overflowX: 'auto' }}>
            <DataTable
                title="Available Courses"
                noHeader
                columns={columns}
                data={courses}
                progressPending={pending}
                pagination
                highlightOnHover
                pointerOnHover
                onRowClicked={handleRowClick}
            />
            </div>

        </div>
    );
}