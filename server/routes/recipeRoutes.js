import { Router } from 'express';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import { likeLimiter, uploadLimiter } from '../middlewares/rateLimiter.js';
import upload from '../middlewares/upload.js';
import validate from '../middlewares/validate.js';
import {
  createRecipeRules,
  updateRecipeRules,
  recipeQueryRules,
  recipeIdRules,
  recipeSlugRules,
} from '../validators/recipeValidator.js';
import {
  createRecipe,
  getAllRecipes,
  getRecipeBySlug,
  getRecipeById,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
  toggleLike,
  uploadImage,
} from '../controllers/recipeController.js';

const router = Router();

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all published recipes (with search, filter, sort, pagination)
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Breakfast, Main Course, Dessert, Beverage, Snack, Soup, Salad]
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, popular, quickest]
 *           default: newest
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
 *         description: Paginated list of published recipes
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
 */
router.get('/', optionalAuth, recipeQueryRules, validate, getAllRecipes);

/**
 * @swagger
 * /api/recipes/my:
 *   get:
 *     summary: Get current user's own recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
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
 *         description: Paginated list of user's recipes
 *       401:
 *         description: Not authenticated
 */
router.get('/my', protect, recipeQueryRules, validate, getMyRecipes);

/**
 * @swagger
 * /api/recipes/slug/{slug}:
 *   get:
 *     summary: Get a single recipe by slug
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe slug
 *     responses:
 *       200:
 *         description: Recipe details
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
 *                     recipe:
 *                       $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 */
router.get('/slug/:slug', optionalAuth, recipeSlugRules, validate, getRecipeBySlug);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a single recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
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
 *                     recipe:
 *                       $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', optionalAuth, recipeIdRules, validate, getRecipeById);

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, ingredients, steps, category, cookTime, servings]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Spaghetti Carbonara
 *               description:
 *                 type: string
 *                 example: A classic Italian pasta dish with creamy egg sauce
 *               ingredients:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ingredient'
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Boil pasta", "Mix eggs with cheese", "Combine and serve"]
 *               category:
 *                 type: string
 *                 enum: [Breakfast, Main Course, Dessert, Beverage, Snack, Soup, Salad]
 *               cookTime:
 *                 type: number
 *                 example: 30
 *               prepTime:
 *                 type: number
 *                 example: 10
 *               servings:
 *                 type: number
 *                 example: 4
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *               image:
 *                 type: string
 *               imagePublicId:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["pasta", "italian"]
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       201:
 *         description: Recipe created
 *       401:
 *         description: Not authenticated
 */
router.post('/', protect, createRecipeRules, validate, createRecipe);

/**
 * @swagger
 * /api/recipes/upload:
 *   post:
 *     summary: Upload a recipe image to Cloudinary
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded
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
 *                     url:
 *                       type: string
 *                     publicId:
 *                       type: string
 *       400:
 *         description: No image file provided
 *       401:
 *         description: Not authenticated
 */
router.post('/upload', protect, uploadLimiter, upload.single('image'), uploadImage);

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update an existing recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ingredient'
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               cookTime:
 *                 type: number
 *               prepTime:
 *                 type: number
 *               servings:
 *                 type: number
 *               difficulty:
 *                 type: string
 *               image:
 *                 type: string
 *               imagePublicId:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       200:
 *         description: Recipe updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Recipe not found
 */
router.put('/:id', protect, recipeIdRules, updateRecipeRules, validate, updateRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Recipe not found
 */
router.delete('/:id', protect, recipeIdRules, validate, deleteRecipe);

/**
 * @swagger
 * /api/recipes/{id}/like:
 *   put:
 *     summary: Toggle like on a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Like toggled
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
 *                     liked:
 *                       type: boolean
 *                     likeCount:
 *                       type: integer
 *       404:
 *         description: Recipe not found
 *       401:
 *         description: Not authenticated
 */
router.put('/:id/like', protect, recipeIdRules, validate, likeLimiter, toggleLike);

export default router;
