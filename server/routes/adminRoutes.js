import { Router } from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import { adminLimiter } from '../middlewares/rateLimiter.js';
import validate from '../middlewares/validate.js';
import {
  updateUserRoleRules,
  adminUserQueryRules,
  adminUserIdRules,
  adminRecipeIdRules,
} from '../validators/adminValidator.js';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllRecipesAdmin,
  deleteRecipeAdmin,
} from '../controllers/adminController.js';

const router = Router();

router.use(protect, adminOnly, adminLimiter);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats including totals, category breakdown, and recent items
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
 *                     totalUsers:
 *                       type: integer
 *                     totalRecipes:
 *                       type: integer
 *                     totalPublished:
 *                       type: integer
 *                     totalDrafts:
 *                       type: integer
 *                     recipesByCategory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     mostLikedRecipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     newestUsers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     newestRecipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 */
router.get('/dashboard', getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of users with recipe counts
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 */
router.get('/users', adminUserQueryRules, validate, getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a single user by ID (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details with recipes and favorites
 *       404:
 *         description: User not found
 */
router.get('/users/:id', adminUserIdRules, validate, getUserById);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: Update a user's role (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Role updated
 *       400:
 *         description: Cannot change own role or remove last admin
 *       404:
 *         description: User not found
 */
router.put('/users/:id/role', updateUserRoleRules, validate, updateUserRole);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user and all related data (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User and related data deleted
 *       400:
 *         description: Cannot delete own account or last admin
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', adminUserIdRules, validate, deleteUser);

/**
 * @swagger
 * /api/admin/recipes:
 *   get:
 *     summary: Get all recipes including drafts (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of all recipes
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 */
router.get('/recipes', getAllRecipesAdmin);

/**
 * @swagger
 * /api/admin/recipes/{id}:
 *   delete:
 *     summary: Delete any recipe (admin only)
 *     tags: [Admin]
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
 *       404:
 *         description: Recipe not found
 */
router.delete('/recipes/:id', adminRecipeIdRules, validate, deleteRecipeAdmin);

export default router;
