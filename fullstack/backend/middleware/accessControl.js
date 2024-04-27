import { pool } from "../config/database.js";

export const accessControl = async (req, res, next) => {
    try {
        const myLength = req.body.id.length;

        if(myLength == 4) {
            // const user = await pool.query("SELECT batch FROM admin_details WHERE user_id=$1", [req.body.id]);
            // if (user.rowCount == 0) res.status(404).user("User Not Found");
            // else {
                req.user_type = 0;
                // req.bid = user.rows[0].batch;
            // }
            

        }
        else if(myLength == 5) {
            const user = await pool.query("SELECT batch FROM instructor_details WHERE user_id=$1", [req.body.id]);
            if (user.rowCount == 0) res.status(404).user("User Not Found");
            else {
                req.user_type = 1;
                req.bid = user.rows[0].batch;
            }
        }
        else if(myLength == 14) {
            const user = await pool.query("SELECT batch FROM student_details WHERE user_id=$1", [req.body.id]);
            if (user.rowCount == 0) res.status(404).user("User Not Found");
            else {
                req.user_type = 2;
                req.bid = user.rows[0].batch;
            }
        }
        else res.status(404).send("Invalid User ID");

        next();
    }

    catch(err) {
        console.log(err.message)
        res.status(401).json("Access control failed")
    }
}