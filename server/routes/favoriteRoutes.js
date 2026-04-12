import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { likeLimiter } from '../middlewares/rateLimiter.js';
import {
  toggleFavorite,
  getMyFavorites,
  checkFavorite,
} from '../controllers/favoriteController.js';

const router = Router();

router.get('/', protect, getMyFavorites);
router.put('/:recipeId', protect, likeLimiter, toggleFavorite);
router.get('/check/:recipeId', protect, checkFavorite);

export default router;
