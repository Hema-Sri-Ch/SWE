import express from "express";
import { pool } from "./config/database.js";
import cors from "cors";


const app = express();

try {
	await pool.connect();
	console.log('Database connected...');
} catch (error) {
	console.error('Connection error: ', error);
}

const port = 5000
app.use(cors());

app.listen(port, ()=> {
	console.log(`App running on port ${port}`)
})
