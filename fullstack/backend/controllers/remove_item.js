import { pool } from "../config/database.js";



// remove user
export const removeUser = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            await client.query("BEGIN");
            const userType = await client.query("SELECT user_type FROM user_login WHERE user_id=$1", [req.body.rid]);
            if(userType.rowCount <= 0) {
                await client.query("ROLLBACK");
                client.release();
                return res.status(404).send("User not found!");
            }

            // Remove Admin
            if(userType.rows[0].user_type == "AD"){
                await client.query("DELETE FROM admin_details WHERE user_id = $1", [req.body.rid]);
                await client.query("DELETE FROM user_login WHERE user_id=$1", [req.body.rid]);
            }

            // Remove Instructor
            else if(userType.rows[0].user_type = "FA"){

                // DELETE INSTRUCTOR COURSES
                await client.query("DELETE FROM instructor_courses WHERE instructor_id=$1", [req.body.rid]);

                // set allocated instructor to null for course_details
                await client.query("UPDATE course_details SET instructor_id=NULL, instructor_name=NULL WHERE instructor_id=$1", [req.body.rid]);

                // DELETE from instructor details
                await client.query("DELETE FROM instructor_details WHERE usr_id=$1", [req.body.rid]);

                // DELETE from user_login
                await client.query("DELETE FROM user_login WHERE user_id=$1", [req.body.id]);
            }

            // Remove Student
            else{

                // DELETE registered (running, NOT completed) student courses [remove student count if his running courses]
                const registeredCourses = await client.query("SELECT course_id FROM student_courses WHERE student_id=$1, status<1");
                for(let i=0; i<registeredCourses.rowCount; i++){
                    await client.query("UPDATE course_details SET student_count=student_count-1 WHERE course_id=$1", registeredCourses.rows[i].course_id);
                }

                await client.query("DELETE FROM student_courses WHERE student_id=$1, status<1",[req.body.rid]);

                // DELETE student electives
                await client.query("DELETE FROM electives WHERE student_id=$1", [req.body.rid]);

                // Can delete his received messages (No difference)
                await client.query("DELETE FROM receives WHERE user_id=$1", [req.body.rid]);

                // DELETE from student details
                await client.query("DELET FROM student_details WHERE user_id=$1", [req.body.rid]);

                // Delete from user_login
                await client.query("DELETE FROM user_login WHERE user_id=$1", [req.body.rid]);
            }

            await client.query("COMMIT");
            res.status(201).send("User deleted successfully");
        }

        else res.status(403).send("Access Denied");
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.log(err.message);
        res.status(500).send("server Error");
    } finally {
        client.release();
    }
}

// remove batch
export const removeBatch = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            await client.query("BEGIN");
            // DELETE users of the batch
            if(req.body.rbid == "AD" || req.body.rbid == "ST") {
                await client.query("ROLLBACK");
                client.release();
                return res.status(403).send("Cannot remove this batch");
            }
            else{
                const users = await client.query("SELECT user_id FROM student_details WHERE batch = $1", [req.body.rbid]);

                for(let i=0; i<users.rowCount; i++){
                    req.body.rid = users.rows[i].user_id;
                    await removeUser(req, res);
                }
            }

            // DELETE FROM custom log access
            await client.query("DELETE FROM custom_access_log WHERE batch_id=$1", [req.body.rbid]);
            

            // DELETE batch from batches
            await client.query("DELETE FROM batches WHERE batch_id=$1", [req.body.rbid]);

            await client.query("COMMIT");
            res.status(201).send("deleted batch successfully");
        }

        else res.status(403).send("Access Denied");
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.log(err.message);
        res.status(500).send("server Error");
    } finally {
        client.release();
    }
}



// remove course
export const removeCourse = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 0){

            await client.query("BEGIN");

            // Remove active course information
            const course_log_id = await client.query("SELECT log_id FROM course_log WHERE course_id=$1 AND isActive=1", [req.body.rcid]);

            if(course_log_id.rowCount){
                // Remove enrolled students(current info in student courses)
                await client.query("DELETE FROM student_courses WHERE course_log_id=$1", [course_log_id.rows[0].log_id]);

                // Remove current info in instructor courses
                await client.query("DELETE FROM instructor_courses WHERE course_log_id=$1", [course_log_id.rows[0].log_id]);

                // Remove current info in instructor courses
                await client.query("DELETE FROM course_log WHERE log_id=$1", [course_log_id.rows[0].log_id]);
            }

            // Remove from course details
            await client.query("DELETE FROM course_details WHERE course_id=$1", [req.body.rcid]);

            await client.query("COMMIT");
            res.status(201).send("deleted course successfully");
        }

        else res.status(403).send("Access Denied");
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.log(err.message);
        res.status(500).send("server Error");
    } finally {
        client.release();
    }
}


// remove feedback form
export const removeForm = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            if(req.body.rfid == 0) {
                client.release();
                return res.status(403).send("Can not remove default form")
            }
            await client.query("BEGIN");

            // set feedback set in course details to null
            await client.query("UPDATE course_details SET feedback_set_id=0 WHERE feedback_set_id=$1", [req.body.rfid]);

            // delete form from feedbackform sets
            await client.query("DELETE FROM feedback_sets WHERE id=$1", [req.body.rfid]);

            await client.query("COMMIT");
        }

        else res.status(403).send("Access Denied");
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.log(err.message);
        res.status(500).send("server Error");
    } finally {
        client.release();
    }
}

export const deActivateCourse = async(req, res, client, mycid)=> {
    req.user_type=0;
    try {
        if(req.user_type == 0){
            // check if it is really active or not
            await client.query("BEGIN");
            const course_log_id = await client.query("SELECT log_id, feedback_response_id FROM course_log WHERE course_id=$1 AND isActive=1", [mycid]);
            if(course_log_id.rowCount){
                console.log(course_log_id.rows[0].log_id, course_log_id.rows[0].feedback_response_id);
                // remove enrolled students
                await client.query("DELETE FROM student_courses WHERE course_log_id=$1", [course_log_id.rows[0].log_id]);

                // remove from instructor courses
                await client.query("DELETE FROM instructor_courses WHERE course_log_id=$1", [course_log_id.rows[0].log_id]);

                // reset course details (status, student count, feeback_response_id, course_log_id)
                await client.query("UPDATE course_details SET status=0, feedback_response_id=NULL, current_log_id=NULL, student_count=0 WHERE course_id=$1", [mycid]);

                
                // remove course log
                await client.query("UPDATE course_log SET isActive=0 WHERE course_id = $1", [mycid]);
                await client.query("DELETE FROM course_log WHERE log_id=$1", [course_log_id.rows[0].log_id]);

                // remove feedback response log
                await client.query("DELETE FROM feedback_responses WHERE id=$1", [course_log_id.rows[0].feedback_response_id]);

  
                await client.query("COMMIT");
//                 res.status(201).send("deactivated course successfully");
                console.log("deactivated successfully");
            }

            else return ;
           
        }

        else return;
    } catch (err) {
        await client.query("ROLLBACK");
        console.log(err.message);
        res.status(500).send("Server error");
    } 
}

export const deactivateCourses = async(req, res) => {
    req.user_type = 0;
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            const array = req.body.dcids;
            console.log(array);
            array.forEach(async(element) => {
                await deActivateCourse(req, res, client, element);
            });
            
        }

        else res.status(403).send("Access Denied");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    } finally {
        client.release();
    }
}