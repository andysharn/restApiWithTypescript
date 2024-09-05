import {Request,Response} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../models/User"
import {io} from "../socket"

//register user 

export const register=async(req:Request,res:Response)=>{
    const {email,password } = req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser =new User ({email,password:hashedPassword});
    await newUser.save();
}

//User Login

export const login =async (req:Request,res:Response)=>{
    const {email,password } = req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(404).json({message:'user not found'});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:'invalid credentials'});
    }

    if(user.sessionToken){
        io.to(user.sessionToken).emit('forcedLogout');
    }
    const sessionToken=jwt.sign({id:user._id},process.env.JWT_SECRET as string ,{expiresIn:'1h'});
    user.sessionToken=sessionToken;
    await user.save();
    res.cookie('token',sessionToken,{httpOnly:true});
    res.json({
        message:'login Successful'
    });
};

//user logout

export const logout =async (req:Request,res:Response)=>{
    res.clearCookie('token');
    res.json({
        message:'logged Out'
    })
}