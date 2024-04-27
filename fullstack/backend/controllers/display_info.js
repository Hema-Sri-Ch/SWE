import { pool } from "../config/database.js";

// Display existed batches
export const fetechBatches = async(req, res) => {
    req.user_type = 0;
    try {
        if(req.user_type < 2){
            const batches = await pool.query("SELECT * FROM batches");
            res.json(batches.rows);
        }

        else res.status(403).send("Access Denied");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// Get Teaching courses, for messaging
export const fetchCourses = async(req, res) => {
    req.user_type = 1;
    try {
        if(req.user_type == 1){
            const courses = await pool.query("SELECT course_id, course_name FROM course_details WHERE course_id IN (SELECT course_id FROM instructor_courses WHERE instructor_id = $1 AND status = 1)", [req.params.id]);
            res.status(200).send(courses.rows);
        }
        else res.status(403).send("Access Denied");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// Get valid grades for grading
export const fetchGrades = async(req, res) => {
    req.user_type = 1;
    try {
        if(req.user_type == 1){
            const grades = await pool.query("SELECT grade FROM grades");
            res.status(201).json(grades.rows);
        }

        else res.status(403).send("Access Denied");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// fetch slots
export const getSlots = async(req, res) => {
    try {
        const slots = await pool.query("SELECT * FROM slots");
        res.status(200).json(slots.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// fetch rooms
export const getRooms = async(req, res) => {
    try {
        const rooms = await pool.query("SELECT * FROM rooms");
        res.status(200).json(rooms.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

export const getPreCourses = async(req, res) => {
    try {
        const courses = await pool.query("Select course_id, course_name FROM course_details");
        res.status(200).send(courses.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
} 

// Display Primary User Details
export const getUserDetails = async (req, res) => {
    try {
        var myID = req.params.id;
        var userDetails;
        console.log(myID);
        if(myID.length == 4) req.user_type = 0;
        else if(myID.length == 5) req.user_type = 1;
        else req.user_type = 2;
        if(req.user_type == 0){
            console.log(0);
            userDetails = await pool.query('SELECT * FROM admin_details WHERE user_id=$1',[myID]);
        }
        else if(req.user_type == 1){
            console.log(1);
            userDetails = await pool.query('SELECT * FROM instructor_details WHERE user_id=$1',[myID]);
        }
        else if(req.user_type == 2){
            console.log(2);
            userDetails = await pool.query('SELECT * FROM student_details WHERE user_id=$1',[myID]);
        }

        else{
            return res.status(401).send("user type: undefined");
        }

        if(userDetails.rows.length == 0){
            return res.status(401).send("user not found.");
        }

        res.json(userDetails.rows[0]);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// Display Student's Completed Courses
export const getCompletedCourses = async(req, res) => {
    req.user_type = 2;
    try {
        if(req.user_type != 2) return res.status(403).send("Access Denied");
        const myID = req.params.id; // TO BE MODIFIED AFTER COMPLETION OF AUTHERIZE MODULE
        const completedCourses = await pool.query("SELECT * FROM student_courses WHERE student_id=$1 AND status=1", [myID]);
        res.json(completedCourses.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// Display Student's Registered Courses
export const getRegisteredCourses = async(req, res) => {
    req.user_type = 2;
    try {
        if(req.user_type != 2) return res.status(403).send("Access Denied");
        const myID = req.params.id; // TO BE MODIFIED AFTER COMPLETION OF AUTHERIZE MODULE
        const registeredCourses = await pool.query("SELECT * FROM student_courses WHERE student_id=$1 AND status<1", [myID]);
        res.json(registeredCourses.rows);
    } catch(err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// Display Instructor's Instructed courses
export const getTaughtCourses = async(req, res) => {
    req.user_type = 1;
    try {
        if(req.user_type != 1) return res.status(403).send("Access Denied");
        const myID = req.params.id; // TO BE MODIFIED AFTER COMPLETION OF AUTHERIZE MODULE
        const taughtCourses = await pool.query("SELECT * FROM instructor_courses WHERE instructor_id=$1 AND status=1", [myID]);
        res.json(taughtCourses.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// Display Instructor's instructing courses
export const getTeachingCourses = async(req, res) => {
    req.user_type = 1;
    try {
        if(req.user_type != 1) return res.status(403).send("Access Denied");
        const myID = req.params.id; // TO BE MODIFIED AFTER COMPLETION OF AUTHERIZE MODULE
        const teachingCourses = await pool.query("SELECT * FROM instructor_courses WHERE instructor_id=$1 AND status<1", [myID]);
        res.json(teachingCourses.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// Display Course Primary details
export const getPrimaryCourseDetails = async(req, res) => {
    try {
        req.user_type = 0;
        if(req.user_type <= 2){
            const cid = req.params.cid;
            const primaryCourseDetails = await pool.query('SELECT * FROM course_details WHERE course_id = $1', [cid]);
            // res.json(primaryCourseDetails.rows)
           
            if(primaryCourseDetails.rowCount == 0) {
                return res.status(401).send("Course not found");
            }

            res.json(primaryCourseDetails.rows[0]);

            // var response = {};
            // response.details = primaryCourseDetails.rows[0];
            // console.log(response);
            // console.log(JSON.stringify(response.details));
        }
        else {
            // do nothing
            return res.status(403).send('Access Denied');
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}


// Display/Fetch Enrolled students list of a course
export const getEnrolledStudents = async(req, res ) => {
    req.user_type = 1;
    try {
        if(req.user_type < 2){
            const cid = req.params.cid;
            const enrolledStudents = await pool.query("SELECT * FROM student_courses WHERE course_id=$1 and status<1", [cid]);
            res.json(enrolledStudents.rows);
        } else {
            res.status(403).send('Access denied');
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}

// Display/Fetch feedback responses of a course
export const getFeedbackResult = async(req, res) => {
    try{
        if(req.user_type < 2){
            const cid = res.params.cid;
            const fid = await pool.query("SELECT feedback_response_id FROM course_details WHERE course_id=$1", [cid]);

            if(fid.rowCount == 0) {
                res.status(401).send("Source not found");
            }

            else {
                const questions = await pool.query("SELECT * FROM feedback_responses WHERE id=$1", [fid.rows[0]]);
                res.json(questions.rows);
            }

        }
        else{
            res.status(403).send("Access Denied");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// Fetch course log
export const getCourseHistory = async(req, res) => {
    try {
        if(req.user_type == 0){
            const Cid = req.params.cid; // TO BE MODIFIED PERHAPS
            //console.log(Cid);
            const courseLog = await pool.query("SELECT * FROM course_log WHERE course_id= $1 AND isActive=0", [Cid]);

            //console.log(courseLog);
            var response = [];
            var feedback_log;
            var prev_enrollers;
            for(var i=0; i< courseLog.rowCount; i++){
                const temp = {};
                temp.row = courseLog.rows[i];
                feedback_log = await pool.query("SELECT * FROM feedback_responses WHERE id=$1", [temp.row.feedback_response_id]);
                temp.feedback = feedback_log.rows[0];
                prev_enrollers = await pool.query("SELECT student_id, grade FROM student_courses WHERE course_log_id=$1", temp.row.log_id);
                temp.enrollers = prev_enrollers;
                response.push(temp);
                //console.log(temp);
            }
            
            //console.log(response);
            res.json(response);
            //res.json(courseLog.rows);

        }
        else {
            res.status(403).send("Access Denied");
        }

        
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
}

// given course id get current feedback form id
// used by students for feedback submission
export const getFeedbackForm1 = async(req, res) => {
    req.user_type = 2;
    try {
        if(req.user_type == 2){
            const feedback_res_id = await pool.query("SELECT feedback_response_id FROM course_details WHERE course_id=$1", [req.params.cid]);
            const feedback_id = await pool.query("SELECT feedback_set_id FROM feedback_responses WHERE id=$1", [feedback_res_id.rows[0].feedback_response_id]);
            const fid = feedback_id.rows[0];
            const feedbackForm = await pool.query("SELECT * FROM feedback_sets WHERE id=$1", [fid]);
            res.json(feedbackForm.rows[0]);
        }

        else {
            res.status(403).send("Access Denied");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// fetch feedback form given feedback form id (used by admin)
export const getFeedbackForm2 = async(req, res) => {
    req.user_type = 0;
    try {
        if(req.user_type == 0){
            const feedbackForm = await pool.query("SELECT * FROM feedback_sets WHERE id = $1", [req.params.fid]);
            res.json(feedbackForm.rows[0]);
        }
        else{
            res.status(403).send("Access Denied");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// get users given the batch
export const getBatchUsers = async(req, res) => {
    req.user_type = 0;
    try {
        if(req.user_type == 0){
            const users = await pool.query("SELECT * FROM user_login WHERE user_id like '" + `${req.params.bid}` + "%'");
            res.json(users.rows);
        }

        else {
            res.status(403).send("Access Denied");
        }
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error");
    }
}

// get all courses
export const getCourses = async(req, res) => {
    try {
        if(req.user_type == 0){
            const courses = await pool.query("SELECT * FROM course_detials");
            res.json(courses.rows);
        }

        else {
            req.status(403).send("Access Denied");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// get active courses
export const getActiveCourses = async(req, res) => {
    req.user_type = 0;
    try {
        if(req.user_type == 0){
            const activeCourses = await pool.query("SELECT * FROM course_details WHERE status = 1");
            res.json(activeCourses.rows);
        }

        else {
            req.status(403).send("Access Denied");
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


export const getNonActiveCourses = async(req, res) => {
    req.user_type = 0;
    try {
        if(req.user_type == 0){
            const nonactiveCourses = await pool.query("SELECT * FROM course_details WHERE status <> 1");
            res.json(nonactiveCourses.rows);
        }

        else {
            req.status(403).send("Access Denied");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}
// get all forms
export const getForms = async(req, res) => {
    req.user_type = 0;
    try {
        if(req.user_type == 0){
            const formDetails = await pool.query("SELECT id, set_name FROM feedback_sets");
            res.json(formDetails.rows);
        }

        else {
            res.status(403).send("Acces Denied");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// get messages received by given user
export const getReceivedMessages = async(req, res) => {
    try {
        // console.log(req.params.id.length);
        if(req.params.id.length == 14) req.user_type = 2;
        if(req.user_type <= 2){
            const messages = await pool.query("SELECT * FROM messages WHERE msg_id IN (SELECT msg_id FROM receivers WHERE user_id=$1)", [req.params.id]);
            res.json(messages.rows);
        }
        else res.status(403).send("Access Denied");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// fetch messages sent by admin or instructor
export const getSentMessages = async(req, res) => {
    try {
        if(req.user_type < 2){
            const messages = await pool.query("SELECT * FROM messages where user_id=$1", [req.params.id]);
            res.json(messages.rows);
        }
        else{
            res.status(403).send("Access Denied");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// fetch receiver user ids for a given message
export const getMessageReceivers = async(req, res) => {
    try {
        const receivers = await pool.query("SELECT user_id FROM receivers WHERE msg_id=$1", [req.body.mid]);
        res.json(receivers.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

export const getMessage = async(req, res) => {
    try {
        const message = await pool.query("SELECT * FROM messages WHERE msg_id=$1", [req.params.msg_id]);
        res.json(message.rows[0]);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}