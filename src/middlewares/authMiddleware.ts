import {Request , Response , NextFunction } from 'express'

import jwt from 'jsonwebtoken'

const authMiddleware=(req: Request , res:Response , next:NextFunction)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:'unauthorized'
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET as string);
        req.user=decoded;
        next()
    }
    catch(err){
      res.status(401).json({
        message:'Invalid Token'
      })
    }
};

export default authMiddleware;