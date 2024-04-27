//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { useEffect } from 'react';
import { useState } from 'react';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import { Navigate } from 'react-router-dom';
import { Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MessageList from './components/messageList';
import CourseDetails from './components/primaryCourseDetails';
import Course from './pages/Course';
import Inbox from './pages/Inbox';
import MessageBox from './components/messageBox';
import Users from './pages/Users';
import Forms from './pages/Forms';
import CoursesA from './pages/Courses';
import Registration from './pages/Registratioin';
import Feedbacks from './pages/feedbacks';


function App() {

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  // );

  return (
    <Fragment className='App-header'>
      <Router>
        <div className="container">
          <Routes>
            <Route 
              // index
              path="/login" 
              element={
                  <Login/>
              } 
            />
            <Route 
              path="/signup" 
              element={ 
                  <SignUp/>
                } 
            />
            
            <Route 
              exact 
              path="/message/:msg_id" 
              element={
                  <MessageBox/>
              } >
              </Route>

            <Route
              path='/messages'
              element={
                <Inbox/>
              }
            />

            <Route
              path='/course/:cid'
              element={
                <Course />
              }
            />

            <Route
              path='/dashboard/:id'
              element={
                <Dashboard />
              }
            />

            <Route
              path='/dashboard/users'
              element={
                <Users />
              }
            />

            <Route
              path='/dashboard/forms'
              element={
                <Forms />
              }
            />

            <Route
              path='/dashboard/courses'
              element={
                <CoursesA />
              }
            />

            <Route
              path='/registration'
              element={
                <Registration />
              }
            />

            <Route
              path='feedbacks'
              element={
                <Feedbacks />
              }
            />
            {/* <Route 
              exact 
              path="/my-posts" 
              element={
                isAuthenticated ? (
                  <MyPostsPage setAuth={setAuth}/>
                ) : (
                  <Navigate to={"/login"} />
                )
              } >
            </Route>

            <Route 
              exact 
              path="/my-profile" 
              element={
                isAuthenticated ? (
                  <MyProfile setAuth={setAuth} />
                ) : (
                  <Navigate to={"/login"} />
                )
              } >
            </Route>

            <Route
              exact
              path='/dashboard/:ID'
              element = {
                isAuthenticated ? (
                  <Post setAuth={setAuth} />
                ) : (
                  < Navigate to = {"/login"} />
                )
              }
            >
            </Route>

            < Route
              exact
              path='/my-posts/:ID'
              element = {
                isAuthenticated ? (
                  <Post setAuth={setAuth} />
                ) : (
                  <Navigate to = {"/login"} />
                )
              }
            /> */}
           
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;