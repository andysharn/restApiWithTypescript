import {body, validationResult} from 'express-validator'
import { Request, Response, NextFunction } from 'express'
export const UserValidationRule =[
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({min:6}).withMessage('password must be atleast 6 character long'),
];
export const validate =( req:Request , res: Response , next:NextFunction)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()});
    }
    next();
};