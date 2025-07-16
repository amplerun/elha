import express from 'express';
import { createGrievance, getMyGrievances, getGrievances } from '../controllers/grievanceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createGrievance).get(protect, admin, getGrievances);
router.route('/mygrievances').get(protect, getMyGrievances);

export default router;