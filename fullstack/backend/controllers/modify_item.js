import { pool } from "../config/database.js";

// Modify user-details
export const editUser = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            await client.query("BEGIN");



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

// Modify Course-details
export const editCourse = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type < 2){
            await client.query("BEGIN");



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


// Modify Feedback Form
export const editForm = async(req, res) => {
    const client = await pool.connect();
    try {
        if(req.user_type == 0){
            await client.query("BEGIN");



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