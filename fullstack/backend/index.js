import express from "express";
import bodyParser from "body-parser";
import { pool } from "./config/database.js";
import cors from "cors";
import studentRoutes from "./routes/index.js";


const app = express();

try {
	await pool.connect();
	console.log('Database connected...');
} catch (error) {
	console.error('Connection error: ', error);
}

const port = 5000
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use('/', studentRoutes);
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, ()=> {
	console.log(`App running on port ${port}`)
})
