import { pool } from "../config/database.js";

const departments = ["AI", "CS", "CH", "EE", "ME"];
const departmentsFull = ["Artificial Intelligence", "Computer Science", "Chemical Engineering", "Electrical Engineering", "Mechanical Engineering"];
const batches = ["BTECH", "MTECH"];

// Add new batch
export const addBatch = async(req, res)=> {
    const client = await pool.connect();
    try {
        if(req.user_type == 0){

            await client.query("BEGIN");
            dept = departments[req.body.dept];
            const department = departmentsFull[req.body.dept];
            const yearSmall = req.body.year - 2000;
            const batch = batches[req.body.batch];
            const batch_id = dept+yearSmall+batch;

            // Check pre-existence
            const preExistance = await client.query("SELECT * FROM batches WHERE batch_id=$1", [batch_id]);
            if(preExistance.rowCount > 0) return res.status(403).send("Batch Already Existed!");

            const addBatchQuery = "INSERT INTO BATCHES(batch_id, department, year, batch) WHERE VALUES($1, $2, $3, $4)";
            const addBatchValues = [batch_id, department, req.body.year, batch];
            await client.query(addBatchQuery, addBatchValues);

            await client.query("COMMIT");
            res.status(201).send("Batch added successfully");
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

// Add new User
export const addUser = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            await client.query("BEGIN");
            const batch = await client.query("SELECT batch_id, department FROM batches WHERE batch_id=$1", [req.body.bid]);
            if(batch.rowCount <= 0) return res.status(404).send("Batch Not Found");

            const batch_id = batch.rows[0].batch_id;
            const department = batch.rows[0].department;
            if(batch_id == "AD"){
                const admins = await client.query("SELECT user_id FROM admin_details");
                const tot = admins.rowCount+1;
                var user_id;
                if(tot < 10) user_id = batch + '0' + (tot);
                else user_id = batch + (tot);
                const userMail = user_id + "@gmail.com"; 

                // Insert in user_login
                const insertUserLoginQuery = "INSERT INTO user_login (user_id, user_name, password, user_mail, user_type) VALUES ($1, $2, $3, $4, $5)";
                const insertUserLoginValues = [user_id, req.body.name, req.body.user_id, userMail, "AD"];
                await client.query(insertUserLoginQuery, insertUserLoginValues);

                // Insert in Admin_details
                const insertAdminQuery = "INSERT INTO admin_details(user_id, user_name ) VALUES ($1, $2)";
                const insertAdminValues = [user_id, req.body.name];
                await client.query(insertAdminQuery, insertAdminValues);
            }

            else if(batch_id == "FA"){
                const instructors = await client.query("SELECT user_id FROM instructor_details");
                const tot = instructors.rowCount+1;
                var user_id;
                if(tot < 10) user_id = batch + '00' + (tot);
                else if(tot < 100) user_id = batch + '0' + (tot);
                else user_id = batch + (tot);
                const userMail = user_id + "@gmail.com"; 

                // Insert in user_login
                const insertUserLoginQuery = "INSERT INTO user_login (user_id, user_name, password, user_mail, user_type) VALUES ($1, $2, $3, $4, $5)";
                const insertUserLoginValues = [user_id, req.body.name, req.body.user_id, userMail, "FA"];
                await client.query(insertUserLoginQuery, insertUserLoginValues);

                // Insert in instructor_details
                const insertInstructorQuery = "INSERT INTO instructor_details(user_id, user_name, department, qualification ) VALUES ($1, $2, $3, $4)";
                const insertInstructorValues = [user_id, req.body.name, req.body.dept, req.body.qual];
                await client.query(insertInstructorQuery, insertInstructorValues);
            }

            else {
                const students = await client.query("SELECT user_id FROM student_details WHERE batch=$1", [batch_id]);
                const tot = students.rowCount+1;
                var user_id;
                if(tot < 10) user_id = batch + '1100' + (tot);
                else if(tot < 100) user_id = batch + '110' + (tot);
                else user_id = batch + (tot);
                const userMail = user_id + "@gmail.com"; 

                // Insert in user_login
                const insertUserLoginQuery = "INSERT INTO user_login (user_id, user_name, password, user_mail, user_type) VALUES ($1, $2, $3, $4, $5)";
                const insertUserLoginValues = [user_id, req.body.name, req.body.user_id, userMail, "ST"];
                await client.query(insertUserLoginQuery, insertUserLoginValues);

                // Insert in instructor_details
                const insertStudentQuery = "INSERT INTO student_details(user_id, user_name, department, batch ) VALUES ($1, $2, $3, $4)";
                const insertStudentValues = [user_id, req.body.name, department, batch_id];
                await client.query(insertStudentQuery, insertStudentValues);
            }


            await client.query("COMMIT");
            res.status(201).send("User added successfully");
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



// Add new Feedback Form

export const addForm = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            await client.query("BEGIN");

            // Check Uniquencess
            const names = await client.query("SELECT set_name FROM feedback_sets WHERE set_name = $1", req.body.name);
            if(names.rowCount > 0) {
                await client.query("ROLLBACK");
                client.release();
                return res.status(403).send("Set name already exists");
            }

            const insertFeedbackSetQuery = "INSERT INTO feedback_sets (set_name, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
            const insertFeedbackSetValues = [req.body.name, req.body.q1, req.body.q2, req.body.q3, req.body.q4, req.body.q5, req.body.q6, req.body.q7, req.body.q8, req.body.q9, req.body.q10];
            await client.query(insertFeedbackSetQuery, insertFeedbackSetValues);

            await client.query("COMMIT");
            res.status(201).send("Form Added Successfully!");
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

export const activateCourse = async(req, res, client, mycid) => {
    console.log("Hey there")
    req.user_type=0;
    try {
        if(req.user_type == 0){
            await client.query("BEGIN");
            let formattedToday, formattedSixMonthsLater;
            // Check if it is already active or not
            const course_log_id = await client.query("SELECT log_id FROM course_log WHERE course_id=$1 AND isActive=1", [mycid]);
            if(course_log_id.rowCount){
                await client.query("ROLLBACK");
                return ;
            }

            const courseDetails = await client.query("SELECT * FROM course_details WHERE course_id=$1", [mycid]);
            if(courseDetails.rowCount <= 0){
                await client.query("ROLLBACK");
                return ;
            }

            // Create feedback response log entitiy
            const insertFeedResQuery = "INSERT INTO feedback_responses(course_id, feedback_set_id) VALUES ($1, $2) RETURNING id";
            const insertFeedResValues = [mycid, courseDetails.feedback_set_id];
            const newFeedRes = await client.query(insertFeedResQuery, insertFeedResValues);
            const newfid = newFeedRes.rows[0].id;

            // Create course log
            const insertNewLogQuery = "INSERT INTO course_log (course_id, instructor_id, instructor_name, feedback_response_id) VALUES ($1, $2, $3, $4) RETURNING log_id";
            const insertNewLogValues = [mycid, courseDetails.instructor_id, courseDetails.instructor_name, newfid];
            const newLog = await client.query(insertNewLogQuery, insertNewLogValues);
            const newLid = newLog.rows[0].log_id;

            // Create instructor courses
            if(courseDetails.instructor_id != null){
                // Get today's date
                const today = new Date();

                // Get the date after 6 months from today
                const sixMonthsLater = new Date(today);
                sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

                // Format dates as 'yyyy-mm-dd'
                formattedToday = today.toISOString().slice(0, 10);
                formattedSixMonthsLater = sixMonthsLater.toISOString().slice(0, 10);

                console.log("Today's date:", formattedToday);
                console.log("Date after 6 months:", formattedSixMonthsLater);

                const insertInstructorCourseQuery = "INSERT INTO instructor_courses(course_log_id, course_id, instructor_id, start_time, end_time) VALUES ($1, $2, $3, $4, $5)";
                const insertInstructorCourseValues = [newLid, mycid, courseDetails.instructor_id, formattedToday, formattedSixMonthsLater];
                await client.query(insertInstructorCourseQuery, insertInstructorCourseValues);
            }


            // Update course details
            await client.query("UPDATE course_details SET student_count=0, start_time=$1, end_time=$2, feedback_response_id=$3, current_log_id=$4, status=1 WHERE course_id=$5", [formattedToday, formattedSixMonthsLater, newfid, newLid, mycid]);
            await client.query("COMMIT");

            console.log("Updated successfully for", mycid);
            // res.status(201).send("Course activated successfully");
        }

        else return ;
    } catch (err) {
        await client.query("ROLLBACK");
        console.log(err.message);
        res.status(500).send("Server Error");
    } 
}

export const activateCourses = async(req, res)=> {
    req.user_type = 0;
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            

            const array = req.body.acids;
            console.log(req.body);
            console.log(array);
            
            array.forEach(async(element) => {
                
                await activateCourse(req, res, client, element);
            });
            
            res.status(201).send("Courses Activated Successfully");
        }

        else res.status(403).send("Access Denied");
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    } finally {
        client.release();
    }
}

// Add new Course
export const addCourse = async(req, res) => {
    console.log(req.body)
    req.user_type = 0;
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            await client.query("BEGIN");
            // ASUMPTION: every course has related department
            
            // Obtaining course id
            let course_dept = req.body.dept;
            var course_id;
            if(course_dept == -1) {
                const courses = await client.query("SELECT course_id FROM course_details WHERE course_id LIKE 'OT%'");
                const tot = courses.rowCount+1;
                if(tot < 10) course_id = "OT00"+tot;
                else if(tot < 100) course_id = "OT0"+tot;
                else course_id = "OT"+ tot;
            }

            else {
                const courses = await client.query("SELECT course_id FROM course_details WHERE course_id LIKE '"+`${departments[course_dept]}`+"%'");
                const tot = courses.rowCount+1;
                course_dept = course_dept - 1;
                if(tot < 10) course_id = departments[course_dept]+"00"+tot;
                else if(tot < 100) course_id = departments[course_dept]+"0"+tot;
                else course_id = departments[course_dept]+ tot;
            }


            console.log(course_id);
            // // Check slot and room existences and clashes (No longer needed)
            // const slotExistence = await client.query("SELECT * FROM slots WHERE slot_id=$1", [req.body.slot_id]);
            // if(slotExistence.rowCount <= 0) {
            //     await client.query('ROLLBACK');
            //     await client.release();
            //     return res.status(404).send("Slot not found");
            // }

            // const roomExistence = await client.query("SELECT * FROM rooms WHERE room_id=$1", [req.body.room_id]);
            // if(slotExistence.rowCount <= 0) {
            //     await client.query('ROLLBACK');
            //     await client.release();
            //     return res.status(404).send("Room not found");
            // }

            


                
            
            
            

            // // Check feedback set id existence (No longer needed)
            // const feedbackSet = await client.query("SELECT id FROM feedback_sets WHERE id=$1, set_name=$2", [req.body.fid, req.body.fname]);
            // if(feedbackSet.rowCount <= 0){
            //     await client.query('ROLLBACK');
            //     await client.release();
            //     return res.status(404).send("Feedback set not found!");
            // }

            const createCourseQuery = "INSERT INTO course_details (course_id) VALUES ($1)";
            const createCourseValules = [course_id];
            await client.query(createCourseQuery, createCourseValules)
            console.log('startS')
            if(req.body.iid !== undefined){
                console.log(1)
                            // Checking Allocated Instructor (No longer Needed)
                const instructorExistence = await client.query("SELECT * FROM instructor_details WHERE user_id=$1", [req.body.iid]);
                if(instructorExistence.rowCount <= 0) {
                    await client.query('ROLLBACK');
                    client.release();
                    return res.status(404).send("Instructor not existed");
                }
                await client.query("UPDATE course_details SET instructor_id=$1, instructor_name=$2 WHERE course_id=$3", [req.body.iid, instructorExistence.user_name, course_id]);
                console.log('instructor')
            }

            if(req.body.slot_id !== undefined){
                await client.query("UPDATE course_details SET slot=$1 WHERE course_id=$2", [req.body.slot_id, course_id]);
                console.log('slot')
            }

            if(req.body.room_id !== undefined){
                await client.query("UPDATE course_details SET room=$1 WHERE course_id=$2", [req.body.room_id, course_id]);

                const checkClash = await client.query("SELECT course_id FROM course_details WHERE slot=$1 AND room=$2", [req.body.slot_id, req.body.room_id]);
                if(checkClash.rowCount > 1){
                    await client.query("UPDATE course_details SET slot=null, room=null WHERE course_id=$1", [course_id]);
                }
                console.log('room')
            }

            if(req.body.prereq_cids !== undefined){
                // Check prerequisites cids
                const course_array = req.body.prereq_cids;
                course_array.forEach(async(element) => {
                    let course = await client.query("SELECT course_id FROM course_details WHERE course_id=$1", [element]);
                    if(course.rowCount <=0){
                        await client.query('ROLLBACK');
                        client.release();
                        return res.status(404).send("Pre-requisite course not found");
                    }
                });
                await client.query("UPDATE course_details SET prereq_cids=$1 WHERE course_id=$2", [req.body.prereq_cids, course_id]);
                console.log('pre')
            }

            if(req.body.eligible_batches !== undefined){
                // Check eligible batch_ids
                const batch_array = req.body.eligible_batches;
                batch_array.forEach(async(element) => {
                    let course = await client.query("SELECT batch_id FROM batches WHERE batch_id=$1", [element]);
                    if(course.rowCount <=0){
                        await client.query('ROLLBACK');
                        client.release();
                        return res.status(404).send("Eligible batch not found");
                    }
                    
                }); 
                await client.query("UPDATE course_details SET eligible_batches=$1 WHERE course_id=$2", [req.body.eligible_batches, course_id]);
                console.log('bat')
            }

            if(req.body.start_time !== undefined){
                await client.query("UPDATE course_details SET start_time=$1 WHERE course_id=$2", [req.body.start_time, course_id]);
            }

            if(req.body.end_time !== undefined){
                await client.query("UPDATE course_details SET end_time=$1 WHERE course_id=$2", [req.body.end_time, course_id]);
            }

            if(req.body.fid !== undefined){
                await client.query("UPDATE course_details SET feedback_set_id=$1 WHERE course_id=$2", [req.body.fid, course_id]);
                console.log('fid')
            }

            // Functions incase the course is set to be active
            if(req.body.active){
                await activateCourse(req, res, client, course_id);
            }
            await client.query("COMMIT");
            res.status(201).send("Course Added Successfully");
            console.log("course added");
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
