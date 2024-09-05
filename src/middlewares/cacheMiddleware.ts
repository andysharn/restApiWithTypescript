import {Request, Response , NextFunction} from 'express';
import {createClient} from 'redis';
const redisClient=createClient();
redisClient.on('error',(err)=>{
    console.error('redis error',err);
});
(async ()=>{
    await redisClient.connect();
})();
export const cacheMiddleware= async (req:Request, res:Response, next: NextFunction)=>{
 const key=req.originalUrl;
 try{
    const cachedData =await redisClient.get(key);
    if(cachedData){
        return res.json(JSON.parse(cachedData));
    }
    next();
 }
 catch(err){
    console.error('redis get error',err);
    next();
 }
};

export const setCache =async ( key:string , value:any ,expiry:number=3600)=>{
    try{
      await redisClient.setEx(key,expiry,JSON.stringify(value));
    }
    catch(err){
        console.error('redis set error',err);
    }

};