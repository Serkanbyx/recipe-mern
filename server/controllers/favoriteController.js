import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

// PUT /api/favorites/:recipeId
export const toggleFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findOne({ _id: recipeId, status: 'published' });
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const isFavorited = req.user.favorites.some(
      (id) => id.toString() === recipeId,
    );

    if (isFavorited) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { favorites: recipeId },
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { favorites: recipeId },
      });
    }

    const updatedUser = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        isFavorited: !isFavorited,
        favoriteCount: updatedUser.favorites.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/favorites
export const getMyFavorites = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    const user = await User.findById(req.user._id);
    const favoriteIds = user.favorites;

    const filter = { _id: { $in: favoriteIds }, status: 'published' };

    const total = await Recipe.countDocuments(filter);
    const totalPages = Math.ceil(total / perPage) || 1;

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate('author', 'name avatar');

    res.json({
      success: true,
      data: { recipes, page: currentPage, totalPages, total },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/favorites/check/:recipeId
export const checkFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const isFavorited = req.user.favorites.some(
      (id) => id.toString() === recipeId,
    );

    res.json({ success: true, data: { isFavorited } });
  } catch (error) {
    next(error);
  }
};
