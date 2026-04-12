import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { likeLimiter } from '../middlewares/rateLimiter.js';
import validate from '../middlewares/validate.js';
import { favoriteRecipeIdRules, favoriteQueryRules } from '../validators/favoriteValidator.js';
import {
  toggleFavorite,
  getMyFavorites,
  checkFavorite,
} from '../controllers/favoriteController.js';

const router = Router();

router.get('/', protect, favoriteQueryRules, validate, getMyFavorites);
router.put('/:recipeId', protect, likeLimiter, favoriteRecipeIdRules, validate, toggleFavorite);
router.get('/check/:recipeId', protect, favoriteRecipeIdRules, validate, checkFavorite);

export default router;
