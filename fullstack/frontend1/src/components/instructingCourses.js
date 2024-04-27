import DataTable from "react-data-table-component";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function InstructingCourses(){

    const [courses, setCourses] = useState([]);
    const [pending, setPending] = useState(true);
    const {id} = useParams();


    const getInstructedCourses = async() => {
        try {
            const response = await fetch(`http://localhost:5000/teachingcourses/${id}`, {
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
        getInstructedCourses();
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
        }
    ]


    return (
        <div>
            <DataTable 
                title="Instructing Courses"
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