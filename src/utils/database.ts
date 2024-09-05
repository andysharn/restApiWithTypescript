import mongoose from 'mongoose';
export const connectDatabase =async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('mongoDB connected');
    
    }
    catch(error){
        console.error('mongoDB connection error',error)
        process.exit(1);
    }
};