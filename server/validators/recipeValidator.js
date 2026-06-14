import { body, query, param } from 'express-validator';

/**
 * Builds a fresh set of recipe body validation chains.
 *
 * express-validator chains are mutable: calling `.optional()` mutates the chain
 * in place and returns the same instance. Returning brand-new chains on every
 * call prevents the update ruleset from leaking its `.optional()` modifier back
 * into the create ruleset (which must keep its required fields).
 */
const buildRecipeBodyRules = () => [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters')
    .escape(),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters')
    .escape(),
  body('ingredients')
    .isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('ingredients.*.amount')
    .trim()
    .notEmpty().withMessage('Ingredient amount is required')
    .isLength({ max: 20 }).withMessage('Ingredient amount must be at most 20 characters')
    .escape(),
  body('ingredients.*.unit')
    .trim()
    .notEmpty().withMessage('Ingredient unit is required')
    .isLength({ max: 20 }).withMessage('Ingredient unit must be at most 20 characters')
    .escape(),
  body('ingredients.*.name')
    .trim()
    .notEmpty().withMessage('Ingredient name is required')
    .isLength({ max: 50 }).withMessage('Ingredient name must be at most 50 characters')
    .escape(),
  body('steps')
    .isArray({ min: 1 }).withMessage('At least one step is required'),
  body('steps.*')
    .trim()
    .notEmpty().withMessage('Step text is required')
    .isLength({ min: 5, max: 500 }).withMessage('Each step must be between 5 and 500 characters')
    .escape(),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Breakfast', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Soup', 'Salad'])
    .withMessage('Invalid category'),
  body('cookTime')
    .notEmpty().withMessage('Cook time is required')
    .isInt({ min: 0 }).withMessage('Cook time cannot be negative'),
  body('prepTime')
    .optional()
    .isInt({ min: 0 }).withMessage('Prep time must be 0 or more minutes'),
  body('servings')
    .notEmpty().withMessage('Servings is required')
    .isInt({ min: 1, max: 100 }).withMessage('Servings must be between 1 and 100'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('image')
    .optional({ values: 'falsy' })
    .isURL().withMessage('Image must be a valid URL'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Each tag must be at most 30 characters')
    .escape(),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
];

// Create: every field validated with its required/optional rules as defined above.
export const createRecipeRules = buildRecipeBodyRules();

// Update (PATCH-like PUT): every field becomes optional so partial updates pass,
// using a separate fresh ruleset to avoid mutating the create chains.
export const updateRecipeRules = buildRecipeBodyRules().map((rule) => rule.optional());

export const recipeQueryRules = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query too long')
    .escape(),
  query('category')
    .optional()
    .isIn(['Breakfast', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Soup', 'Salad'])
    .withMessage('Invalid category'),
  query('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty'),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'popular', 'quickest']).withMessage('Invalid sort option'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
];

export const recipeIdRules = [
  param('id')
    .isMongoId().withMessage('Invalid recipe ID'),
];

export const recipeSlugRules = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required')
    .isSlug().withMessage('Invalid slug format'),
];
