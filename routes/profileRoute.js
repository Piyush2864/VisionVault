import express from 'express';
import { createOrUpdateProfile, getProfile } from '../controllers/profileController';


const router = express.Router();

router.route('/').post(createOrUpdateProfile);
router.route('/').get(getProfile);



export default router;