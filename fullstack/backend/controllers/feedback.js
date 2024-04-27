import { pool } from "../config/database.js";

// FEEDBACK HANDLERS

// Modify feedback response database based on the result fetched
export const handleFeedbackResponse = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 2){
            const cid = req.body.cid;

            // input of feedback response = 10 integers each belong to {1, 2, 3, 4, 5}
            await client.query('BEGIN'); // Begin transaction
            const f_res_id = await client.query("SELECT feedback_response_id FROM course_details WHERE course_id=$1", [cid]);
            const rid = f_res_id.rows[0].feedback_response_id;
            const array = req.body.feedResponse;
            

            for (var i = 0; i < 10; i++) {
                let columnName = "question" + (i + 1); // Dynamically construct the column name
                
                // Construct the SQL query with the actual column name
                let feedbackResUpdateQuery = `UPDATE feedback_responses SET ${columnName}[${array[i]}] = ${columnName}[${array[i]}] + 1 WHERE id = $1`;
                let feedbackResUpdateValues = [rid];
                
                await client.query(feedbackResUpdateQuery, feedbackResUpdateValues);
            }
            

            await client.query("COMMIT"); // Commit transaction
            res.status(201).send("Feedback updated successfully")
        }

        else res.status(403).send("Access Denied");
        
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.log(err.message);
        res.status(500).send("Server Error");
    } finally {
        client.release(); // Release client back to the pool
    }
}