import express from 'express';
import { loginUserController,logoutUserController,registerUserController } from '../controllers/userController.js';
import { createOrUpdateProfile, getProfile } from '../controllers/profileController.js';
import {authMiddlewares} from '../middlewares/authMiddleware.js'


const router = express.Router();

router.route('/register').post(registerUserController);
router.route('/login').post(loginUserController);
router.route('/logout').post(authMiddlewares(),logoutUserController);


router.route('/create').post(authMiddlewares(),createOrUpdateProfile);
router.route('/get').get( authMiddlewares(),getProfile)


export default router;