
import {Request,Response} from 'express'
import prisma from '../utils/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {io} from "../socket"

//register user 
const JWT_SECRET=process.env.JWT_SECRET||'abcd1234'
export class AuthService{
     async  register=async(email:string,password :string){
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser =await prisma.user.create({ data:{email,password:hashedPassword}});
        return newUser;
    }
    

}

//User Login

export const login =async (req:Request,res:Response)=>{
    const {email,password } = req.body;
    const user=await prisma.user.findUnique({where:{email}});
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