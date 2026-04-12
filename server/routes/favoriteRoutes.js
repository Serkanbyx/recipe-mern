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

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get current user's favorite recipes
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Paginated list of favorite recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       401:
 *         description: Not authenticated
 */
router.get('/', protect, favoriteQueryRules, validate, getMyFavorites);

/**
 * @swagger
 * /api/favorites/{recipeId}:
 *   put:
 *     summary: Toggle a recipe as favorite
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID to toggle
 *     responses:
 *       200:
 *         description: Favorite toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isFavorited:
 *                       type: boolean
 *                     favoriteCount:
 *                       type: integer
 *       404:
 *         description: Recipe not found
 *       401:
 *         description: Not authenticated
 */
router.put('/:recipeId', protect, likeLimiter, favoriteRecipeIdRules, validate, toggleFavorite);

/**
 * @swagger
 * /api/favorites/check/{recipeId}:
 *   get:
 *     summary: Check if a recipe is favorited by current user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID to check
 *     responses:
 *       200:
 *         description: Favorite status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isFavorited:
 *                       type: boolean
 *       401:
 *         description: Not authenticated
 */
router.get('/check/:recipeId', protect, favoriteRecipeIdRules, validate, checkFavorite);

export default router;
