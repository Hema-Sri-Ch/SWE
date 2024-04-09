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
    getFeedbackForm1,
    getFeedbackForm2,
    getBatchUsers,
    getCourses,
    getActiveCourses,
    getForms,
    getMessageReceivers,
    getReceivedMessages,
    getSentMessages,
} from "../controllers/display_info.js";

import { 
    adminMsg, 
    instructorMsg 
} from "../controllers/messages.js";

const router = express.Router();


router.post('/login', logIn);
router.get('/userdetails/:id', getUserDetails);
router.get('/completedcourses/:id', accessControl, getCompletedCourses);
router.get('/registerdcourses/:id', accessControl, getRegisteredCourses);
router.get('/taughtcourses/:id', accessControl, getTaughtCourses);
router.get('/teachingcourses/:id', accessControl, getTeachingCourses);
router.get('/enrolledstudents/:cid', accessControl, getEnrolledStudents);
router.get('/feedbackresponse/:cid', accessControl, getFeedbackResult);
router.get('/coursedetails/:cid', accessControl, getPrimaryCourseDetails);
router.get('/coursehistory/:cid', accessControl, getCourseHistory);
router.get('/feedbackforms', accessControl, getForms);
router.get('/feedbackforms/:cid', accessControl, getFeedbackForm1);
router.get('/feedbackforms/:fid', accessControl, getFeedbackForm2);
router.get('/batchusers', accessControl, getBatchUsers);
router.get('/courses', accessControl, getCourses);
router.get('/activecourses', accessControl, getActiveCourses);
router.get('/receivedmessages/:id', accessControl, getReceivedMessages);
router.get('/sentmessages/:id', accessControl, getSentMessages);
router.get('/messagereceivers', accessControl, getMessageReceivers);

router.post('/adminmessage', accessControl, adminMsg);
router.post('/instructormessage', accessControl, instructorMsg);
export default router;