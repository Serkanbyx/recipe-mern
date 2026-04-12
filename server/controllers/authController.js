import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  role: user.role,
  preferences: user.preferences,
  createdAt: user.createdAt,
});

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: { user: sanitizeUser(user), token },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: { user: sanitizeUser(user), token },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, data: { user: sanitizeUser(req.user) } });
};

// PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/auth/account
export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password is incorrect' });
    }

    // Lazy-import to avoid circular dependency (Recipe model created in later steps)
    const Recipe = (await import('../models/Recipe.js')).default;

    await Recipe.deleteMany({ author: user._id });
    await Recipe.updateMany({ likes: user._id }, { $pull: { likes: user._id } });
    await User.findByIdAndDelete(user._id);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/preferences
export const updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;
    const user = req.user;

    const validThemes = ['light', 'dark', 'system'];
    const validFontSizes = ['small', 'medium', 'large'];
    const validDensities = ['compact', 'comfortable', 'spacious'];
    const validLanguages = ['en'];

    if (preferences.theme && validThemes.includes(preferences.theme)) {
      user.preferences.theme = preferences.theme;
    }
    if (preferences.fontSize && validFontSizes.includes(preferences.fontSize)) {
      user.preferences.fontSize = preferences.fontSize;
    }
    if (preferences.contentDensity && validDensities.includes(preferences.contentDensity)) {
      user.preferences.contentDensity = preferences.contentDensity;
    }
    if (typeof preferences.animations === 'boolean') {
      user.preferences.animations = preferences.animations;
    }
    if (preferences.language && validLanguages.includes(preferences.language)) {
      user.preferences.language = preferences.language;
    }
    if (preferences.privacy) {
      if (typeof preferences.privacy.showEmail === 'boolean') {
        user.preferences.privacy.showEmail = preferences.privacy.showEmail;
      }
      if (typeof preferences.privacy.showFavorites === 'boolean') {
        user.preferences.privacy.showFavorites = preferences.privacy.showFavorites;
      }
    }

    await user.save();

    res.json({ success: true, data: { preferences: user.preferences } });
  } catch (error) {
    next(error);
  }
};
