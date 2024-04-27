import DataTable from "react-data-table-component";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function CompletedCourses(){

    const [courses, setCourses] = useState([]);
    const [pending, setPending] = useState(true);
    const {id} = useParams();


    const getCompletedCourses = async() => {
        try {
            const response = await fetch(`http://localhost:5000/completedcourses/${id}`, {
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
        getCompletedCourses();
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
            name: "Grade",
            selector: (row) => row.grade,
            sortable: true
        }
    ]


    return (
        <div>
            <DataTable 
                title="Completed Courses"
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