import { pool } from "../config/database.js";

// COURSE REGISTRATION
export const registerCourse = async(req, res) => {
    req.user_type = 2;
    const client = await pool.connect();
    try {

        if(req.user_type == 2){
            
            await client.query("BEGIN"); // begin transaction

            // Check course existence check
            const courses = await client.query("SELECT course_id FROM course_details WHERE course_id=$1", [req.body.cid]);
            if(courses.rowCount <= 0){
                await client.query("ROLLBACK");
                //();
                return res.status(404).send("Course not found");
            }

            // Check if already registered (in case)
            const studentCourse = await client.query("SELECT * from student_courses WHERE (course_id=$1 AND student_id=$2 AND status=-1)", [req.body.cid, req.body.id]);
            if(studentCourse.rowCount > 0){
                await client.query("ROLLBACK");
                //();
                return res.status(203).send("Already registered!");
            }

            

            const courseDetails = await client.query("SELECT * FROM course_details WHERE course_id=$1 and status=1", [req.body.cid]);
            if(courseDetails.rowCount == 0) {
                await client.query("ROLLBACK");
                //();
                return res.status(404).send("No such active course found");
            }
            // Check Eligibility
            const batchArray = courseDetails.rows[0].eligible_batches;
            // let eligibility = false;

            if (!batchArray.includes(req.body.bid)) {
                await client.query("ROLLBACK");
                //();
                return res.status(203).send("Not eligible for registering this course");
            }

            // for(var i=0; i<batchArray.length; i++){
            //     if(batchArray[i] == req.bid) eligibiligy=true;
            // }

            // if(eligibility == false) {
            //     await client.query("ROLLBACK");
            //     //();
            //     return res.status(403).send("Not eligible for registering this course");
            // }
            console.log('eligible')
            // Check prereq
            const getStdCourses = await client.query("SELECT course_id FROM student_courses WHERE student_id=$1 AND status=1", [req.body.id]);
            const courseArray = courseDetails.rows[0].prereq_cids;

            let result = false;
            const stdCrses = getStdCourses.rows
            console.log(stdCrses);
            console.log(courseArray);
            if (courseArray !== null) {
                for (let i = 0; i < courseArray.length; i++) {
                    if (!getStdCourses.rows.some(row => row.course_id === courseArray[i])) {
                        await client.query("ROLLBACK");
                        //();
                        return res.status(203).send("Prerequisites are not matched");
                    }
                }
            }
            // for(var i=0; i<courseArray.length; i++){
            //     result = false;
            //     for(var j=0; j<getStdCourses.rowCount; j++){
            //         if(courseArray[i] == getStdCourses.rows[j].course_id) result = true;
            //     }
            //     if(result == false) return res.status(403).send("Prerequisites are not matched");
            // }

            // Max Limit Check
            console.log(courseDetails.rows[0].student_count, courseDetails.rows[0].max_students);
            if(courseDetails.rows[0].student_count === courseDetails.rows[0].max_students) {
                await client.query("ROLLBACK");
                //();
                return res.status(203).send("Max enrollers limit reached")
            }

            // Check clashes (slot clash)
            const stdRunningCourses = await client.query("SELECT slot FROM student_courses WHERE student_id=$1 AND status<1", [req.body.id]);
            for(var i=0; i<stdRunningCourses.rowCount; i++){
                if(stdRunningCourses.rows[i].slot === courseDetails.slot) {
                    await client.query("ROLLBACK");
                    //();
                    return res.status(203).send("Courses Clashing")
                }
            }

            // Add entity to student_courses
            const insertStdCrsQuery = "INSERT INTO student_courses (course_log_id, course_id, student_id, start_time, end_time, slot, room, type, credits, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, -1)";
            const insertStdCrsValues = [courseDetails.current_log_id, req.body.cid, req.body.id, courseDetails.start_time, courseDetails.end_time, courseDetails.slot, courseDetails.room, req.body.type, courseDetails.credits];
            await client.query(insertStdCrsQuery, insertStdCrsValues);

            // Modify course_details (student count)
            await client.query("UPDATE course_details SET student_count=student_count+1 WHERE course_id=$1", [req.body.cid]);
            await client.query("COMMIT"); // commit transaction
            return res.status(201).send("Course Registered Successfully");
        }

        else return res.status(403).send("Access Denied");
        
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.log(err.message);
        return res.status(500).send("Server Error");
    } finally{
        client.release();
    }
}


// COURSE DEREGISTRATION
export const derRegisterCourse = async(req, res) => {
    req.user_type = 2;
    const client = await pool.connect();
    try {
        if(req.user_type == 2){
            await client.query("BEGIN");
 
            // Remove entity from student courses
            const removeStdCoursesQuery = "DELETE FROM student_courses WHERE (student_id=$1 AND course_id=$2 AND status=-1)";
            const removeStdCoursesValues = [req.body.id, req.body.cid];
            await client.query(removeStdCoursesQuery, removeStdCoursesValues);

            // Modify course_details (studnet count)
            const modifyCourseDetailsQuery = "UPDATE course_details SET student_count=student_count-1 WHERE course_id=$1";
            const modifyCourseDetailsValues = [req.body.cid];
            await client.query(modifyCourseDetailsQuery, modifyCourseDetailsValues);
            await client.query("COMMIT");
            res.status(201).send("Course deregistered successfully");
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