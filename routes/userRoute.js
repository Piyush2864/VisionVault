import express from 'express';
import { loginUserController,logoutUserController,registerUserController } from '../controllers/userController.js';


const router = express.Router();

router.route('/register').post(registerUserController);
router.route('/login').post(loginUserController);
router.route('/logout').post(logoutUserController);


export default router;