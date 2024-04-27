import DataTable from "react-data-table-component";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function RegisteredCourses(){

    const [courses, setCourses] = useState([]);
    const [pending, setPending] = useState(true);
    const {id} = useParams();


    const getRegisteredCourses = async() => {
        try {
            const response = await fetch(`http://localhost:5000/registeredcourses/${id}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                setCourses(data);
                setPending(false);
            })
        } catch (error) {
            console.error("Error fetching message:", error);
        }
    }

    useEffect(() => {
        getRegisteredCourses();
    }, []);

    const columns = [
        {
            name: "Course ID",
            selector: (row) => row.course_id,
            sortable: true
        },
        {
            name: "start time",
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
            sortable: true
        }
    ]

    return (
        <div>
            <DataTable 
                title="Registered Courses"
                noHeader
                columns={columns}
                data={courses}
                progressPending={pending}
                defaultSortFieldId="time"
                pagination
                highlightOnHover
                pointerOnHover
            />
        </div>
    );
}