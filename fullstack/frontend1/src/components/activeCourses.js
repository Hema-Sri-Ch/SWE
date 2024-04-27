import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from 'react-bootstrap';


export default function ActiveCourses({cid, updateCid}) {

    const [courses, setCourses] = useState([]);
    const [pending, setPending] = useState(true);
    const [dcids, setDcids] = useState([]);

    const getActiveCourses = async() => {
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
        getActiveCourses();
    }, []);

    const handleRowClick = (row) => {
        updateCid(row.course_id);
    };

    const handleCheckboxChange = (e) => {
        const courseId = e.target.value;
        if (e.target.checked) {
          // Add the selected course to the list
          setDcids([...dcids, courseId]);
        } else {
          // Remove the course from the list
          setDcids(dcids.filter((id) => id !== courseId));
        }
      };

      const handleSubmit = async(e) => {
        // Perform actions with selectedCourses
        e.preventDefault();
        console.log('Selected courses:', dcids);
        const DeactivateCourses = async() => {
            const body = {dcids};
            console.log(JSON.stringify(body));
            try {
                const response = await fetch(`http://localhost:5000/deactivatecourses`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                
                console.log(response);
                window.location.reload();
                
            } catch (error) {
                console.log("Updating error: ", error);
            }
        }

        DeactivateCourses();
        // Clear selected courses
        setDcids([]);
        
      };
    const columns = [
        {
            name: 'Select',
            selector: 'id',
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
    ];

    return(
        <div>
            <div style={{ overflowX: 'auto' }}>
            <DataTable
                title="Active Courses"
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
            <Button onClick={handleSubmit}>Deactivate</Button>
        </div>
    );
}