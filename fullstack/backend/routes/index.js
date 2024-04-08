import express from "express";

import { accessControl } from "../middleware/accessControl.js";

import {
    logIn    
} from "../controllers/authentication.js";

import {
    getUserDetails,
    getCompletedCourses,
    getRegisteredCourses,
    getTaughtCourses,
    getTeachingCourses,
    getEnrolledStudents,
    getFeedbackResult,
    getPrimaryCourseDetails,
    getCourseHistory,
} from "../controllers/display_info.js";

const router = express.Router();


router.post('/login', logIn);
router.get('/userdetails', getUserDetails);
router.get('/completedcourses', accessControl, getCompletedCourses);
router.get('/registerdcourses', accessControl, getRegisteredCourses);
router.get('/taughtcourses', accessControl, getTaughtCourses);
router.get('/teachingcourses', accessControl, getTeachingCourses);
router.get('/enrolledstudents', accessControl, getEnrolledStudents);
router.get('/feedbackresponse', accessControl, getFeedbackResult);
router.get('/coursedetails', accessControl, getPrimaryCourseDetails);
router.get('/coursehistory', accessControl, getCourseHistory);

export default router;