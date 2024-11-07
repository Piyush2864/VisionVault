import express from 'express';
import { subDetails } from '../controllers/dashboardController';


const router = express.Router();


router.route('/subdetails/:categories').get(authMiddlewares(), subDetails);