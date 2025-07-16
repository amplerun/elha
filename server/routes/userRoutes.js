import express from 'express';
const router = express.Router();
import {
  registerUser, loginUser, getMe, firebaseAuthBridge, getUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', loginUser);
router.post('/firebase-auth', firebaseAuthBridge);
router.get('/me', protect, getMe);

export default router;