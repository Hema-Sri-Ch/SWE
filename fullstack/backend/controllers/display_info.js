import { pool } from "../config/database.js";

// Display Primary User Details
export const getUserDetails = async (req, res) => {
    try {
        
        var userDetails;
        if(req.user_type = 0){
            userDetails = await pool.query('SELECT * FROM admin_details WHERE user_id=$1',[myID]);
        }
        else if(req.uesr_type = 1){
            userDetails = await pool.query('SELECT * FROM instructor_details WHERE user_id=$1',[myID]);
        }
        else if(req.user_type == 2){
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
    try {
        if(req.user_type != 2) return res.status(403).send("Access Denied");
        const myID = req.body.id; // TO BE MODIFIED AFTER COMPLETION OF AUTHERIZE MODULE
        const completedCourses = await pool.query("SELECT * FROM student_courses WHERE student_id=$1 AND status=1", [myID]);
        res.json(completedCourses.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// Display Student's Registered Courses
export const getRegisteredCourses = async(req, res) => {
    try {
        if(req.user_type != 2) return res.status(403).send("Access Denied");
        const myID = req.body.id; // TO BE MODIFIED AFTER COMPLETION OF AUTHERIZE MODULE
        const registeredCourses = await pool.query("SELECT * FROM student_courses WHERE student_id=$1 AND status<1", [myID]);
        res.json(registeredCourses.rows);
    } catch(err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// Display Instructor's Instructed courses
export const getTaughtCourses = async(req, res) => {
    try {
        if(req.user_type != 1) return res.status(403).send("Access Denied");
        const myID = req.body.id; // TO BE MODIFIED AFTER COMPLETION OF AUTHERIZE MODULE
        const taughtCourses = await pool.query("SELECT * FROM instructor_courses WHERE instructor_id=$1 AND status=1", [myID]);
        res.json(taughtCourses.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// Display Instructor's instructing courses
export const getTeachingCourses = async(req, res) => {
    try {
        if(req.user_type != 1) return res.status(403).send("Access Denied");
        const myID = req.body.id; // TO BE MODIFIED AFTER COMPLETION OF AUTHERIZE MODULE
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
        if(req.user_type <= 2){
            const cid = req.body.cid;
            const primaryCourseDetails = await pool.query('SELECT * FROM course_details WHERE course_id = $1', [cid]);
            // res.json(primaryCourseDetails.rows)
           
            if(primaryCourseDetails.rowCount == 0) {
                return res.status(401).send("Course not found");
            }

            res.json(primaryCourseDetails.rows);

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
    try {
        if(req.user_type < 2){
            const cid = res.body.cid;
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
            const cid = res.body.cid;
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
            const Cid = req.body.cid; // TO BE MODIFIED PERHAPS
            //console.log(Cid);
            const courseLog = await pool.query("SELECT * FROM course_log WHERE course_id= $1", [Cid]);

            //console.log(courseLog);
            var response = [];
            var feedback_log;
            for(var i=0; i< courseLog.rowCount; i++){
                const temp = {};
                temp.row = courseLog.rows[i];
                feedback_log = await pool.query("SELECT * FROM feedback_responses WHERE id=$1", [temp.row.feedback_response_id]);
                temp.feedback = feedback_log.rows[0];
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