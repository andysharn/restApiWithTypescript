import {Request,Response} from 'express'
import { AuthService } from '../services/authService';
//register user 

export const register=async(req:Request,res:Response)=>{
    const {email,password } = req.body;
    try{
        const User =await AuthService.register(email,password);
        res.status(201).json(User);
    } catch (error){
        res.status(400).json({error:error.message});
    }

  
}

//User Login

export const login =async (req:Request,res:Response)=>{
    const {email,password } = req.body;
  try{
    const user =await AuthService.login(email,password, res);
    res.status(200).json({user
    });
  }catch(error){
  res.status(400).json({
    error:error.message
  })

  }}
  
  export const logout =async (req:Request,res:Response)=>{
    res.clearCookie('token');
    res.json({
        message:'logged Out'
    })
}



//user logout

