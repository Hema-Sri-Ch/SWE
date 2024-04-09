import { pool } from "../config/database.js";

// MESSAGE HANDLERS


// Message Sent by Admin
export const adminMsg = async (req, res) => {
    const client = await pool.connect();
    try {
        if (req.user_type === 0) {
            const currentDate = new Date();
            const postgresTimestamp = currentDate.toISOString(); // Using ISO format for timestamp
            
            await client.query('BEGIN'); // Begin transaction
            
            const messageInsertQuery = "INSERT INTO messages (message, user_id, time) VALUES ($1, $2, $3) RETURNING msg_id";
            const messageInsertValues = [req.body.text, req.body.id, postgresTimestamp];
            const messageResult = await client.query(messageInsertQuery, messageInsertValues);
            const messageId = messageResult.rows[0].msg_id;
            
            const receiversInsertQuery = "INSERT INTO receivers (msg_id, user_id) SELECT $1 as msg_id, user_id FROM student_details WHERE batch = $2";
            const receiversInsertValues = [messageId, req.body.bid];
            await client.query(receiversInsertQuery, receiversInsertValues);
            
            await client.query('COMMIT'); // Commit transaction
            
            res.status(201).send("Message sent successfully");
        } else {
            res.status(403).send("Access Denied");
        }
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.log(err.message);
        res.status(500).send("Server Error");
    } finally {
        client.release(); // Release client back to the pool
    }
};

export const instructorMsg = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 1){
            const currentDate = new Date();
            const postgresTimestamp = currentDate.toISOString(); // Using ISO format for timestamp
            
            await client.query('BEGIN'); // Begin transaction
            const messageInsertQuery = "INSERT INTO messages (message, user_id, time) VALUES ($1, $2, $3) RETURNING msg_id";
            const messageInsertValues = [req.body.text, req.body.id, postgresTimestamp];
            const messageResult = await client.query(messageInsertQuery, messageInsertValues);
            const messageId = messageResult.rows[0].msg_id;

            const receiversInsertQuery = "INSERT INTO receivers (msg_id, user_id) SELECT $1 as msg_id, student_id FROM student_courses WHERE status=1 AND course_id=$2";
            const receiversInsertValues = [messageId, req.body.cid];
            await client.query(receiversInsertQuery, receiversInsertValues);
            
            await client.query('COMMIT'); // Commit transaction
            
            res.status(201).send("Message sent successfully");

        }
        else res.status(403).send("Access Denied");
    } catch (err) {
        await client.query('ROLLBACK');
        console.log(err.message)
        res.status(500).send("Server Error");
    } finally {
        client.release();
    }
}