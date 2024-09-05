import express, {Application} from 'express';
import  {createServer} from 'http';
import cookieParser from 'cookie-parser';
import prisma from "../src/utils/database"

import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import {initSocket} from './socket'
const app:Application=express();
const server =createServer(app);
console.log("entered");
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth',authRoutes);
initSocket(server);

const PORT =process.env.PORT || 5000;
server.listen(PORT,async()=>{
    try{
        await prisma.$connect();
        console.log(`server is running on port ${PORT}`);
    }
    catch(error){
        console.error('error connecting to database ',error);
        process.exit(1)
    }
})

process.on('SIGINT',async()=>{
    await prisma.$disconnect();
    process.exit(0);
})



