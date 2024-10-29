import express from 'express';
import { loginUserController,logoutUserController,registerUserController } from '../controllers/userController.js';
      import { createOrUpdateProfile, getProfile } from '../controllers/profileController';


const router = express.Router();

router.route('/register').post(registerUserController);
router.route('/login').post(loginUserController);
router.route('/logout').post(logoutUserController);

router.route('/').post(createOrUpdateProfile);
router.route('/').get(getProfile)


export default router;