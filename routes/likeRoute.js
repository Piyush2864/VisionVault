import express from 'express';
import { likeMedia } from '../controllers/likeController.js';
import { authMiddlewares } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.route('/media/like').post(authMiddlewares(), likeMedia);