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
    getNonActiveCourses,
    getForms,
    getMessageReceivers,
    getReceivedMessages,
    getSentMessages,
    getMessage,
    fetchCourses,
    fetechBatches,
    fetchGrades,
    getSlots,
    getRooms,
    getPreCourses,
} from "../controllers/display_info.js";

import { 
    adminMsg, 
    instructorMsg 
} from "../controllers/messages.js";

import { handleFeedbackResponse } from "../controllers/feedback.js";
import { handleGrades } from "../controllers/grade_management.js";
import { derRegisterCourse, registerCourse } from "../controllers/registration.js";
import { activateCourses, addCourse } from "../controllers/add_item.js";
import { deactivateCourses } from "../controllers/remove_item.js";

const router = express.Router();


router.post('/login', logIn);
router.get('/userdetails/:id', getUserDetails);
router.get('/completedcourses/:id', getCompletedCourses);
router.get('/registeredcourses/:id', getRegisteredCourses);
router.get('/taughtcourses/:id',  getTaughtCourses);
router.get('/teachingcourses/:id', getTeachingCourses);
router.get('/enrolledstudents/:cid', getEnrolledStudents);
router.get('/feedbackresponse/:cid', accessControl, getFeedbackResult);
router.get('/coursedetails/:cid', getPrimaryCourseDetails);
router.get('/coursehistory/:cid', accessControl, getCourseHistory);
router.get('/feedbackforms', getForms);
router.get('/feedbackforms1/:cid', getFeedbackForm1);
router.get('/feedbackforms2/:fid', getFeedbackForm2);
router.get('/batchusers/:bid', getBatchUsers);
router.get('/courses', accessControl, getCourses);
router.get('/activecourses', getActiveCourses);
router.get('/deactivecourses', getNonActiveCourses);
router.get('/receivedmessages/:id', getReceivedMessages);
router.get('/sentmessages/:id', accessControl, getSentMessages);
router.get('/messagereceivers', accessControl, getMessageReceivers);
router.get('/message/:msg_id', getMessage);
router.get('/courses/:id', fetchCourses);
router.get('/batches', fetechBatches);
router.get('/grades', fetchGrades);
router.get('/slots', getSlots);
router.get('/rooms', getRooms);
router.get('/prereqcids', getPreCourses);

router.post('/adminmessage',  adminMsg);
router.post('/instructormessage', instructorMsg);
router.post('/handlefeedback', accessControl, handleFeedbackResponse);
router.post('/handlegrades', accessControl, handleGrades);
router.post('/registercourse', registerCourse);
router.post('/deregistercourse', derRegisterCourse);
router.post('/activatecourses', activateCourses);
router.post('/deactivatecourses', deactivateCourses);
router.post('/addcourse', addCourse);
export default router;