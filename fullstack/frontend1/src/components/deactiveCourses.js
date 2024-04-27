import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from 'react-bootstrap';



export default function DeactiveCourses({cid, updateCid}) {

    const [courses, setCourses] = useState([]);
    const [pending, setPending] = useState(true);
    const [acids, setAcids] = useState([]);

    const getActiveCourses = async() => {
        try {
            const response = await fetch(`http://localhost:5000/deactivecourses`, {
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
        getActiveCourses();
    }, []);

    const handleRowClick = (row) => {
        updateCid(row.course_id);
    };

    const handleCheckboxChange = (e) => {
        const courseId = e.target.value;
        if (e.target.checked) {
          // Add the selected course to the list
          setAcids([...acids, courseId]);
        } else {
          // Remove the course from the list
          setAcids(acids.filter((id) => id !== courseId));
        }
      };

      const handleSubmit = async(e) => {
        // Perform actions with selectedCourses
        e.preventDefault();
        console.log('Selected courses:', acids);
        const ActivateCourses = async() => {
            const body = {acids};
            console.log(JSON.stringify(body));
            try {
                const response = await fetch(`http://localhost:5000/activatecourses`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                
                console.log(response);
                if (response.ok) {
                    window.location.reload();
                }
            } catch (error) {
                console.log("Updating error: ", error);
            }
        }

        ActivateCourses();
        // Clear selected courses
        setAcids([]);
        
      };


    const columns = [
        {
            name: 'Select',
            selector: (row) => row.course_id,
            cell: (row) => <input type="checkbox" value={row.course_id} onChange={handleCheckboxChange} />,
            sortable: false,
          },
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
    ];

    return(
        <div>
            <div style={{ overflowX: 'auto' }}>
            <DataTable
                title="deactive Courses"
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

            {/* Submit button */}
            <Button onClick={handleSubmit}>Activate</Button>
        </div>
    );
}