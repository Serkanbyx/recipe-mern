import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { escapeRegex, deleteCloudinaryImage } from '../utils/helpers.js';

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalRecipes,
      totalPublished,
      totalDrafts,
      recipesByCategory,
      mostLikedRecipes,
      newestUsers,
      newestRecipes,
    ] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Recipe.countDocuments({ status: 'published' }),
      Recipe.countDocuments({ status: 'draft' }),
      Recipe.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Recipe.find()
        .sort({ likes: -1 })
        .limit(5)
        .select('title slug likes image')
        .populate('author', 'name avatar'),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role avatar createdAt'),
      Recipe.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title slug status category image createdAt')
        .populate('author', 'name avatar'),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRecipes,
        totalPublished,
        totalDrafts,
        recipesByCategory,
        mostLikedRecipes,
        newestUsers,
        newestRecipes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    if (role) filter.role = role;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / perPage) || 1;

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .select('-password');

    const userIds = users.map((u) => u._id);
    const recipeCounts = await Recipe.aggregate([
      { $match: { author: { $in: userIds } } },
      { $group: { _id: '$author', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(recipeCounts.map((r) => [r._id.toString(), r.count]));

    const usersWithRecipeCount = users.map((user) => ({
      ...user.toObject(),
      recipeCount: countMap.get(user._id.toString()) || 0,
    }));

    res.json({
      success: true,
      data: { users: usersWithRecipeCount, page: currentPage, totalPages, total },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [recipes, favoriteRecipes] = await Promise.all([
      Recipe.find({ author: user._id })
        .sort({ createdAt: -1 })
        .select('title slug status category image createdAt'),
      Recipe.find({ _id: { $in: user.favorites } })
        .select('title slug image category'),
    ]);

    res.json({
      success: true,
      data: { user, recipes, favorites: favoriteRecipes },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be "user" or "admin"' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }

    const targetUser = await User.findById(req.params.id).select('-password');

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (targetUser.role === 'admin' && role === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot remove the last admin. Promote another user first',
        });
      }
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({ success: true, data: { user: targetUser } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (targetUser.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin. Promote another user first',
        });
      }
    }

    const userRecipes = await Recipe.find({ author: targetUser._id });

    const cloudinaryDeletePromises = userRecipes
      .filter((recipe) => recipe.imagePublicId)
      .map((recipe) => deleteCloudinaryImage(recipe.imagePublicId));
    await Promise.all(cloudinaryDeletePromises);

    await Recipe.deleteMany({ author: targetUser._id });

    await Recipe.updateMany(
      { likes: targetUser._id },
      { $pull: { likes: targetUser._id } },
    );

    await targetUser.deleteOne();

    res.json({ success: true, message: 'User and related data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/recipes
export const getAllRecipesAdmin = async (req, res, next) => {
  try {
    const { search, category, status, difficulty, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (search) {
      filter.title = { $regex: escapeRegex(search), $options: 'i' };
    }
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (difficulty) filter.difficulty = difficulty;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

    const total = await Recipe.countDocuments(filter);
    const totalPages = Math.ceil(total / perPage) || 1;

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate('author', 'name avatar email');

    res.json({
      success: true,
      data: { recipes, page: currentPage, totalPages, total },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/recipes/:id
export const deleteRecipeAdmin = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    await deleteCloudinaryImage(recipe.imagePublicId);

    await User.updateMany(
      { favorites: recipe._id },
      { $pull: { favorites: recipe._id } },
    );

    await recipe.deleteOne();

    res.json({ success: true, message: 'Recipe deleted successfully' });
  } catch (error) {
    next(error);
  }
};
