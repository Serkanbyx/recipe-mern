import swaggerJsdoc from 'swagger-jsdoc';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe MERN API',
      version,
      description:
        'Full-featured RESTful API for a recipe sharing platform. Supports authentication, CRUD operations for recipes, favorites, image uploads via Cloudinary, and admin management.',
      contact: {
        name: 'Serkanby',
        url: 'https://serkanbayraktar.com/',
      },
    },
    servers: [
      {
        url: 'https://recipe-mern-d384.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication and user management' },
      { name: 'Recipes', description: 'Recipe CRUD operations' },
      { name: 'Favorites', description: 'User favorite recipes' },
      { name: 'Admin', description: 'Admin-only management endpoints' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664a1f2e3b4c5d6e7f8a9b0c' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            avatar: { type: 'string', example: 'https://res.cloudinary.com/...' },
            bio: { type: 'string', example: 'Passionate home chef' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            preferences: { $ref: '#/components/schemas/Preferences' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Preferences: {
          type: 'object',
          properties: {
            theme: { type: 'string', enum: ['light', 'dark', 'system'], example: 'system' },
            fontSize: { type: 'string', enum: ['small', 'medium', 'large'], example: 'medium' },
            contentDensity: { type: 'string', enum: ['compact', 'comfortable', 'spacious'], example: 'comfortable' },
            animations: { type: 'boolean', example: true },
            language: { type: 'string', enum: ['en'], example: 'en' },
            privacy: {
              type: 'object',
              properties: {
                showEmail: { type: 'boolean', example: false },
                showFavorites: { type: 'boolean', example: true },
              },
            },
          },
        },
        Ingredient: {
          type: 'object',
          required: ['amount', 'unit', 'name'],
          properties: {
            amount: { type: 'string', example: '2' },
            unit: { type: 'string', example: 'cups' },
            name: { type: 'string', example: 'flour' },
          },
        },
        Recipe: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664a1f2e3b4c5d6e7f8a9b0c' },
            title: { type: 'string', example: 'Chocolate Cake' },
            slug: { type: 'string', example: 'chocolate-cake' },
            description: { type: 'string', example: 'A rich and moist chocolate cake recipe' },
            ingredients: { type: 'array', items: { $ref: '#/components/schemas/Ingredient' } },
            steps: { type: 'array', items: { type: 'string' }, example: ['Preheat oven to 350°F', 'Mix dry ingredients'] },
            category: { type: 'string', enum: ['Breakfast', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Soup', 'Salad'] },
            cookTime: { type: 'number', example: 45 },
            prepTime: { type: 'number', example: 15 },
            servings: { type: 'number', example: 8 },
            difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'], example: 'Medium' },
            image: { type: 'string', example: 'https://res.cloudinary.com/...' },
            author: { $ref: '#/components/schemas/UserSummary' },
            likes: { type: 'array', items: { type: 'string' } },
            likeCount: { type: 'number', example: 12 },
            totalTime: { type: 'number', example: 60 },
            status: { type: 'string', enum: ['draft', 'published'], example: 'published' },
            tags: { type: 'array', items: { type: 'string' }, example: ['chocolate', 'dessert'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserSummary: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'John Doe' },
            avatar: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            totalPages: { type: 'number', example: 5 },
            total: { type: 'number', example: 50 },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
