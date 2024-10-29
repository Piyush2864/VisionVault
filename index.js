import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import connectToDb from './db/config.js';


dotenv.configDotenv();

const app = express();


app.use(cors())

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user', authRoute);


connectToDb();

app.get('/', (req, res)=> {
    res.send("Hello World");
});

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`)
});