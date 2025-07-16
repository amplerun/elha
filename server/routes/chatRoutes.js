import express from 'express';
import { accessChat, fetchChats, fetchMessages } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, accessChat).get(protect, fetchChats);
router.route('/:chatId/messages').get(protect, fetchMessages);

export default router;