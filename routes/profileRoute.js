import express from 'express';
import { createProfile, uploadProfilePicture } from '../controllers/profileController.js';
import { authMiddlewares } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/mediaMiddleware.js';


const router = express.Router();

router.route('/profile-create').post(authMiddlewares(), createProfile);
router.route('/profile-photo').post(authMiddlewares(),  upload.fields([
    {name: 'profilePicture', maxCount: 1}
]),uploadProfilePicture )



export default router;