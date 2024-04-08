import { pool } from '../config/database.js';

export const logIn = async (req, res) => {
    try {
        const {user_id, password} = req.body;

        const user = await pool.query("SELECT * from users_login where user_id = $1", [user_id]);

        if(user.rows.length === 0){
            return res.status(401).send('Incorrect user id');
        }

        if(user.rows[0].password === password){
            console.log('User found');
            return res.json(ture);
        }

        else{
            return res.status(401).send('Incorrect password');
        }
    }

    catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
}