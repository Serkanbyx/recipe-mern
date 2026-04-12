import { Router } from 'express';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import { likeLimiter } from '../middlewares/rateLimiter.js';
import {
  createRecipe,
  getAllRecipes,
  getRecipeBySlug,
  getRecipeById,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
  toggleLike,
} from '../controllers/recipeController.js';

const router = Router();

router.get('/', optionalAuth, getAllRecipes);
router.get('/my', protect, getMyRecipes);
router.get('/slug/:slug', optionalAuth, getRecipeBySlug);
router.get('/:id', optionalAuth, getRecipeById);
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.put('/:id/like', protect, likeLimiter, toggleLike);

export default router;
