import React from "react";
import { useParams } from "react-router-dom";
import CourseDetails from "../components/primaryCourseDetails";
import GradeForm from "../components/gradeForm";

export default function Course() {
    const {cid} = useParams();
    return(
        <div>
            <h1> Course {cid} </h1>
            <CourseDetails />
            <GradeForm />
        </div>
    );
}
