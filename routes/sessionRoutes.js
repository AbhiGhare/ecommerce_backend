import express from 'express';
import { getAllSessions, getSessionsByEmail, updateDeliveryInfo } from '../controllers/storeSessionDetails.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getAllSessions);
router.get('/userSession', protect, getSessionsByEmail);
router.put('/:sessionId', updateDeliveryInfo);
export default router;
