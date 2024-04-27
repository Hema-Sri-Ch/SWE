import React from "react";
import UserDetails from "../components/primaryUserDetails";
import CompletedCourses from "../components/completedCourses";
import RegisteredCourses from "../components/registeredCourses";
import { useParams } from "react-router-dom";
import InstructingCourses from "../components/instructingCourses";
import InstructedCourses from "../components/instructedCourses";
// import NavBar from "../components/NavBar";
// import PostsTable from "../components/PostsTable";


function Dashboard({setAuth}) {

    const {id} = useParams();

    if(id.length === 4) return (
        <div>
            <h1>Dashboard </h1>
            <UserDetails />
        </div>
    );

    else if(id.length === 5) return (
        <div>
            <h1>Dashboard </h1>
            <UserDetails />
            <h1> Instructing Courses</h1>
            <InstructingCourses/>
            <h1> Instructed Courses</h1>
            <InstructedCourses />
        </div>
    );

    else if ( id.length ) return (
        <div>
            <h1>Dashboard </h1>
            <UserDetails />
            <h1> Registered Courses</h1>
            <RegisteredCourses />
            <h1> Completed Courses</h1>
            <CompletedCourses />
        </div>
    );

    else return (
        <div>
            <h1> 404 Page not found</h1>
        </div>
    );
};

export default Dashboard;