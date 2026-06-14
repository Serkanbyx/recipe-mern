import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { escapeRegex, deleteCloudinaryImage } from '../utils/helpers.js';

// POST /api/recipes
export const createRecipe = async (req, res, next) => {
  try {
    const {
      title, description, ingredients, steps, category,
      cookTime, prepTime, servings, difficulty,
      image, imagePublicId, tags, status,
    } = req.body;

    const recipe = await Recipe.create({
      title, description, ingredients, steps, category,
      cookTime, prepTime, servings, difficulty,
      image, imagePublicId, tags, status,
      author: req.user._id,
    });

    const populatedRecipe = await recipe.populate('author', 'name avatar');

    res.status(201).json({ success: true, data: { recipe: populatedRecipe } });
  } catch (error) {
    next(error);
  }
};

// GET /api/recipes
export const getAllRecipes = async (req, res, next) => {
  try {
    const { search, category, difficulty, sort = 'newest', page = 1, limit = 12 } = req.query;

    const filter = { status: 'published' };

    if (search) {
      filter.title = { $regex: escapeRegex(search), $options: 'i' };
    }
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { likesCount: -1, createdAt: -1 },
      quickest: { cookTime: 1 },
    };
    const sortBy = sortOptions[sort] || sortOptions.newest;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    const total = await Recipe.countDocuments(filter);
    const totalPages = Math.ceil(total / perPage) || 1;

    const recipes = await Recipe.find(filter)
      .sort(sortBy)
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

// GET /api/recipes/slug/:slug
export const getRecipeBySlug = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar bio');

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({ success: true, data: { recipe } });
  } catch (error) {
    next(error);
  }
};

// GET /api/recipes/:id
export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar bio');

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const isOwner = req.user && recipe.author._id.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === 'admin';

    if (recipe.status !== 'published' && !isOwner && !isAdmin) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({ success: true, data: { recipe } });
  } catch (error) {
    next(error);
  }
};

// GET /api/recipes/my
export const getMyRecipes = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 12 } = req.query;

    const filter = { author: req.user._id };
    if (status) filter.status = status;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

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

// PUT /api/recipes/:id
export const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const isOwner = recipe.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this recipe' });
    }

    const {
      title, description, ingredients, steps, category,
      cookTime, prepTime, servings, difficulty,
      image, imagePublicId, tags, status,
    } = req.body;

    if (title !== undefined) recipe.title = title;
    if (description !== undefined) recipe.description = description;
    if (ingredients !== undefined) recipe.ingredients = ingredients;
    if (steps !== undefined) recipe.steps = steps;
    if (category !== undefined) recipe.category = category;
    if (cookTime !== undefined) recipe.cookTime = cookTime;
    if (prepTime !== undefined) recipe.prepTime = prepTime;
    if (servings !== undefined) recipe.servings = servings;
    if (difficulty !== undefined) recipe.difficulty = difficulty;
    if (tags !== undefined) recipe.tags = tags;
    if (status !== undefined) recipe.status = status;

    if (imagePublicId !== undefined && imagePublicId !== recipe.imagePublicId) {
      await deleteCloudinaryImage(recipe.imagePublicId);
      recipe.imagePublicId = imagePublicId;
    }
    if (image !== undefined) recipe.image = image;

    await recipe.save();
    const updatedRecipe = await recipe.populate('author', 'name avatar');

    res.json({ success: true, data: { recipe: updatedRecipe } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/recipes/:id
export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const isOwner = recipe.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this recipe' });
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

// POST /api/recipes/upload
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/recipes/:id/like
export const toggleLike = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, status: 'published' });

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const userId = req.user._id;
    const isLiked = recipe.likes.some((id) => id.toString() === userId.toString());

    const update = isLiked
      ? { $pull: { likes: userId }, $inc: { likesCount: -1 } }
      : { $addToSet: { likes: userId }, $inc: { likesCount: 1 } };

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipe._id, update, { new: true });

    res.json({
      success: true,
      data: { liked: !isLiked, likeCount: updatedRecipe.likes.length },
    });
  } catch (error) {
    next(error);
  }
};
