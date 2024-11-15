import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from '../backend/routes/authRoute.js'
import mediaRoute from '../backend/routes/mediaRoute.js'
import likeRoute from '../backend/routes/mediaRoute.js'
import dashborad from '../backend/routes/dashboardRoute.js'
import profileRoute from '../backend/routes/profileRoute.js'
import connectToDb from './db/config.js';


dotenv.configDotenv();

const app = express();


app.use(cors())

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user', userRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/media', mediaRoute );
app.use('/api/v1/like', likeRoute);
app.use('/api/v1/dashboard', dashborad);

// app.use('/api/v1/profile', profileRoute);


connectToDb();

app.get('/', (req, res)=> {
    res.send("Hello World");
});

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`)
});