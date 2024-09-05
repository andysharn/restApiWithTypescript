import express, {Application} from 'express';
import  {createServer} from 'http';
import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import {initSocket} from './socket'
// dotenv.config();
const app:Application=express();
const server =createServer(app);
console.log("entered");
const PORT =process.env.PORT || 5000;
const MONGO_URI =process.env.MONGO_URI||'';

mongoose.connect(MONGO_URI).then(()=>{
    console.log('mongoDB Connected');
    server.listen(PORT,()=> console.log(`server running on port ${PORT}`));
}).catch((error)=>console.error('error connecting to mongodb',error));


app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth',authRoutes);
initSocket(server);


