import {Router} from 'express';
import { login,logout, register } from '../controllers/authController'
import { UserValidationRule,validate } from '../middlewares/validate';
const router =Router();
router.post('/login',UserValidationRule,validate,login);
router.post('/logout',logout);
router.post('/register',register);
export default router;