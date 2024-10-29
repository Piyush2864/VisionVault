import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth from '../backend/routes/authRoute.js'
import connectToDb from './db/config.js';


dotenv.configDotenv();

const app = express();


app.use(cors())

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user', auth);
// app.use('/api/v1/profile', profileRoute);


connectToDb();

app.get('/', (req, res)=> {
    res.send("Hello World");
});

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`)
});