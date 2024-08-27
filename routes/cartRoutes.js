// routes/cartRoutes.js
import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have an auth middleware

const router = express.Router();

// Add item to cart
router.post('/cart', protect, addToCart);

// Get cart items
router.get('/cart', protect, getCart);

// Update item quantity in cart
router.put('/cart/item', protect, updateCartItem);

// Remove item from cart
router.delete('/cart/item', protect, removeFromCart);

export default router;
