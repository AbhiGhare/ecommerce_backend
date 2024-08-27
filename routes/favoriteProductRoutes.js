// routes/favoriteProductRoutes.js
import express from 'express';
import {
  addToFavorites,
  getFavorites,
  clearFavorites,
  removeSingleFavorite,
} from '../controllers/favoriteProductController.js';
import { protect } from '../middleware/authMiddleware.js';  // Assuming you have a middleware for authentication

const router = express.Router();

router.post('/add', protect, addToFavorites);
router.get('/', protect, getFavorites);
router.delete('/remove/:productId', protect, removeSingleFavorite);

router.delete('/clear', protect, clearFavorites);

export default router;
