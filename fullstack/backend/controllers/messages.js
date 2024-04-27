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
            const messageHead = req.body.bid + ": " +req.body.title;
            const messageInsertQuery = "INSERT INTO messages (msg_head, message, user_id, time) VALUES ($1, $2, $3, $4) RETURNING msg_id";
            const messageInsertValues = [messageHead, req.body.text, req.body.id, postgresTimestamp];
            const messageResult = await client.query(messageInsertQuery, messageInsertValues);
            const messageId = messageResult.rows[0].msg_id;
            
            var receiversInsertQuery;
            if(req.body.bid == "FA") receiversInsertQuery =  "INSERT INTO receivers (msg_id, user_id) SELECT $1 as msg_id, user_id FROM instructor_details";
            else if(req.body.bid == 'AD') receiversInsertQuery = "INSERT INTO receivers (msg_id, user_id) SELECT $1 as msg_id, user_id FROM admin_details";
            else receiversInsertQuery = "INSERT INTO receivers (msg_id, user_id) SELECT $1 as msg_id, user_id FROM student_details WHERE batch = $2";
            var receiversInsertValues = [messageId, req.body.bid];
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
    req.user_type = 1;
    try {
        console.log(`function called`)
        if(req.user_type == 1){
            const currentDate = new Date();
            const postgresTimestamp = currentDate.toISOString(); // Using ISO format for timestamp
            
            await client.query('BEGIN'); // Begin transaction
            const messageHead = req.body.cid + ": " +req.body.title;
            const messageInsertQuery = "INSERT INTO messages (msg_head, message, user_id, time) VALUES ($1, $2, $3, $4) RETURNING msg_id";
            const messageInsertValues = [messageHead, req.body.text, req.body.id, postgresTimestamp];
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