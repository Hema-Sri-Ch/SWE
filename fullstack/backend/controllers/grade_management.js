import { pool } from "../config/database.js";


export const computeCGPA = async(req, res) => {
    try {
        let cgpa = 0.0;
        let cgInp = await pool.query("SELECT grade, credits FROM student_courses WHERE student_id=$1", [req.body.sid]);

        console.log(cgInp.rows);
        let totLen = cgInp.rowCount;
        var temp;
        var sumOfProd = 0;
        var sumOfCred = 0;
        cgInp.rows.forEach((i) => {
            if(i.grade == 'A') temp = 10;
            else if(i.grade == 'A-') temp = 9;
            else if(i.grade == 'B') temp = 8;
            else if(i.grade == 'B-') temp = 7;
            else if(i.grade == 'C') temp = 6;
            else if(i.grade == 'C-') temp = 5;
            else if(i.grade == 'D') temp = 4;
            
            sumOfCred = sumOfCred + i.credits;
            sumOfProd = sumOfProd + temp*(i.credits);
        })
        
        cgpa = sumOfProd/sumOfCred;

        // Update CGPA in student_details
        await pool.query("UPDATE student_details SET CGPA=$1 WHERE user_id=$2", [cgpa, req.body.sid]);
        console.log("new cgpa = ", cgpa);

        
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}


// GRADE HANDLER

// Grade students of the course
export const handleGrades = async(req, res) => {
    const client = await pool.connect();

    try {
        if(req.user_type == 1) {

            // Modify Student Courses table ==> students would get grades info
            await client.query("BEGIN");
            const cid = req.body.cid;
            const arr_len = req.body.mygrades.length;
            const array = req.body.mygrades;

            const courseDetails = await client.query("SELECT current_log_id, start_time, end_time, instructor_id, instructor_name, feedback_response_id, feedback_set_id FROM course_details WHERE course_id=$1", [cid]);
            const logid = courseDetails.rows[0].current_log_id;
            console.log(array[1]);
            console.log("logid = ", logid);

            array.forEach(async(element) => {
                let stdtCrsUpdateQuery = "UPDATE student_courses SET status=1, grade=$1 WHERE course_log_id=$2 AND student_id=$3 RETURNING type, credits";
                let stdCrsUpdateValues = [element.grade, logid, element.id];
                let stdCrsUpdate = await client.query(stdtCrsUpdateQuery, stdCrsUpdateValues);
                console.log("Updated student courses", element, stdCrsUpdate.rows[0].credits, stdCrsUpdate.rows[0].type);

                // Update electives of a student as well
                await client.query(`UPDATE electives SET ${stdCrsUpdate.rows[0].type}=${stdCrsUpdate.rows[0].type}+$1 WHERE student_id=$2`, [ stdCrsUpdate.rows[0].credits, element.id]);
                console.log('updated electives');
                
            });
            
            // for(var i=0; i<arr_len; i++) {
            //     let stdtCrsUpdateQuery = "UPDATE student_courses SET status=1, grade=$1 WHERE course_log_id=$2 AND student_id=$3 RETURNING type, credits";
            //     let stdCrsUpdateValues = [array[i].grade, logid, array[i].id];
            //     let stdCrsUpdate = await client.query(stdtCrsUpdateQuery, stdCrsUpdateValues);
            //     console.log("Updated student courses", array[i], stdCrsUpdate.rows[0].credits, stdCrsUpdate.rows[0].type);

            //     // Update electives of a student as well
            //     await client.query(`UPDATE electives SET ${stdCrsUpdate.rows[0].type}=${stdCrsUpdate.rows[0].type}+$1 WHERE student_id=$2`, [ stdCrsUpdate.rows[0].credits, array[i].id]);
            //     console.log('updated electives');
            //     // Compute new CGPA
            //     let cgpa = 0.0;

            //     let cgInp = await client.query("SELECT grade, credits FROM student_courses WHERE student_id=$1", [array[i].id]);
            //     console.log(cgInp.rows);
            //     let totLen = cgInp.rowCount;
            //     var temp;
            //     var sumOfProd = 0;
            //     var sumOfCred = 0;
            //     for(var i=0; i<totLen; i++){
            //         if(cgInp.rows[i].grade == 'A') temp = 10;
            //         else if(cgInp.rows[i].grade == 'A-') temp = 9;
            //         else if(cgInp.rows[i].grade == 'B') temp = 8;
            //         else if(cgInp.rows[i].grade == 'B-') temp = 7;
            //         else if(cgInp.rows[i].grade == 'C') temp = 6;
            //         else if(cgInp.rows[i].grade == 'C-') temp = 5;
            //         else if(cgInp.rows[i].grade == 'D') temp = 4;
                    
            //         sumOfCred = sumOfCred + cgInp.rows[i].credits;
            //         sumOfProd = sumOfProd + temp*cgInp.rows[i].credits;
            //     }

            //     cgpa = sumOfProd/sumOfCred;

            //     // Update CGPA in student_details
            //     await client.query("UPDATE student_details SET CGPA=$1 WHERE user_id=$2", [cgpa, array[i].id]);
            //     console.log("new cgpa = ", cgpa);
            // }

            // Modify Instructor Courses
            await client.query("UPDATE instructor_courses SET status=0 WHERE course_log_id=$1", [logid]);
            console.log("instructor_courses")

            // Modify courselog
            const crsLogUpdateQuery = "UPDATE course_log SET isActive=0, start_time=$1, end_time=$2, instructor_id=$3, instructor_name=$4, feedback_response_id=$5 WHERE log_id=$6";
            const crsLogUpdateValues = [courseDetails.start_time, courseDetails.end_time, courseDetails.instructor_id, courseDetails.instructor_name, courseDetails.feedback_response_id, logid];
            await client.query(crsLogUpdateQuery, crsLogUpdateValues);
            console.log("course_log");

            // // creating newlog for next term of this course <COULD BE DONE AT THE TIME OF COURSE ACTIVATION>
            // const insertNewLogQuery = "INSERT INTO course_log (course_id) VALUES ($1) RETURNING log_id";
            // const insertNewLogValues = [cid];
            // const newLog = await client.query(insertNewLogQuery, insertNewLogValues);
            // const newLid = newLog.rows[0].log_id;

            // // creating new Feed response for next term of this course <COULD BE DONE AT THE TIME OF ACTIVATION>
            // const insertFeedResQuery = "INSERT INTO feedback_responses(course_id, feedback_set_id) VALUES ($1, $2) RETURNING id";
            // const insertFeedResValues = [cid, courseDetails.feedback_set_id];
            // const newFeedRes = await client.query(insertFeedResQuery, insertFeedResValues);
            // const newfid = newFeedRes.rows[0].id;

            // Modify Course Details
            const crsUpdateQuery = "UPDATE course_details SET student_count=0, status=0 WHERE course_id=$1";
            const crsUpdateValues = [cid];
            await client.query(crsUpdateQuery, crsUpdateValues);

            await client.query("COMMIT");
            array.forEach(async(element) => {
                req.body.sid = element.id;
                await computeCGPA(req, res);
            })
            res.status(201).send("Graded students successfully");
        }

        else res.status(403).send("Access Denied");
        
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.log(err.message);
        res.status(500).send("Server Error");
    } finally {
        client.release();
    }
}