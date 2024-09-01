import express from 'express';
import { createPaymentIntent, getAllPayments, getAllStripeOrders, getAllTransactions, retrieve } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', createPaymentIntent);

router.get('/stripe/orders', getAllStripeOrders);
router.get('/stripe/transactions', getAllTransactions);
router.get('/stripe/payments', getAllPayments);
router.get('/stripe/retrieve-checkout-session/:sessionId', retrieve);
export default router;
