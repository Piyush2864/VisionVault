import express from 'express';
import { subDetails } from '../controllers/dashboardController.js';
import { authMiddlewares } from '../middlewares/authMiddleware.js';


const router = express.Router();


router.route('/subdetails/:category').get(authMiddlewares(), subDetails);

export default router;