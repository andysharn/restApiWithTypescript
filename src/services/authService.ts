
import {Request,Response} from 'express'
import prisma from '../utils/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {io} from "../socket"

//register user 
const JWT_SECRET=process.env.JWT_SECRET||'abcd1234'
export class AuthService{
     async  register(email:string,password :string){
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser =await prisma.user.create({ data:{email,password:hashedPassword}});
        return newUser;
    }

   async login(email:string,password:string,res:Response){
        const user=await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'invalid credentials'});
        }
    const token =jwt.sign({iserId : user.id},JWT_SECRET,{
        expiresIn:'1h',
    });
    res.cookie('token',token,{httpOnly:true});
    return user;

   }
async validateUser(token:string){
    try{
        const decoded =jwt.verify(token,JWT_SECRET);
        const user= await prisma.user.findUnique({
            where :{id:decoded.userId},
        });
        return user;
    }catch(error){
        throw new Error('invalid token')
    }
}
    

}

