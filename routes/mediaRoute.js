import express from 'express';
import { upload } from '../middlewares/mediaMiddleware.js';
import { createMedia, deleteMedia } from '../controllers/mediaController.js';
import {authMiddlewares} from '../middlewares/authMiddleware.js'


const router = express.Router();

router.route('/upload').post(authMiddlewares(), upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'video', maxCount: 1}
]), createMedia);

// router.route('/update-upload/:mediaId').post(authMiddlewares(), upload.fields([
//     {name: 'image', maxCount: 1}
// ]), updateMedia);

router.route('/delete/:mediaId').delete(authMiddlewares(), deleteMedia);

export default router; 