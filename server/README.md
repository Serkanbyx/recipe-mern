[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

# Recipe MERN API

Full-featured RESTful API for a recipe sharing platform built with **Express 5**, **MongoDB (Mongoose 9)**, and **JWT authentication**. Supports recipe CRUD, image uploads via Cloudinary, user favorites, like system, admin panel, and Swagger documentation.

## Features

- **Authentication** — Register, login, JWT-based auth with role management (user/admin)
- **Recipes** — Full CRUD with search, filter, sort, and pagination
- **Image Uploads** — Cloudinary integration via Multer
- **Favorites & Likes** — Toggle favorites and likes on recipes
- **User Preferences** — Theme, font size, content density, privacy settings
- **Admin Dashboard** — User management, recipe moderation, statistics
- **Security** — Helmet, rate limiting, mongo sanitization, HPP protection
- **API Documentation** — Interactive Swagger UI at `/api-docs`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose 9 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer + Cloudinary |
| Validation | express-validator |
| Security | Helmet, express-rate-limit, express-mongo-sanitize, HPP |
| Docs | Swagger (swagger-jsdoc + swagger-ui-express) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB instance

### Installation

```bash
cd server
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CORS_ORIGIN` | Allowed CORS origin |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Running

```bash
# Development
npm run dev

# Production
npm start

# Seed database
npm run seed
```

### API Documentation

Once the server is running, visit:

```
http://localhost:5000/api-docs
```

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login | No |
| GET | `/me` | Get current user | Yes |
| GET | `/users/:userId` | Get public profile | Optional |
| PUT | `/profile` | Update profile | Yes |
| PUT | `/password` | Change password | Yes |
| PUT | `/preferences` | Update preferences | Yes |
| DELETE | `/account` | Delete account | Yes |

### Recipes (`/api/recipes`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all published recipes | Optional |
| GET | `/my` | Get user's own recipes | Yes |
| GET | `/slug/:slug` | Get recipe by slug | Optional |
| GET | `/:id` | Get recipe by ID | Optional |
| POST | `/` | Create recipe | Yes |
| POST | `/upload` | Upload recipe image | Yes |
| PUT | `/:id` | Update recipe | Yes |
| DELETE | `/:id` | Delete recipe | Yes |
| PUT | `/:id/like` | Toggle like | Yes |

### Favorites (`/api/favorites`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user's favorites | Yes |
| PUT | `/:recipeId` | Toggle favorite | Yes |
| GET | `/check/:recipeId` | Check favorite status | Yes |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard` | Dashboard statistics | Admin |
| GET | `/users` | List all users | Admin |
| GET | `/users/:id` | Get user details | Admin |
| PUT | `/users/:id/role` | Update user role | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| GET | `/recipes` | List all recipes | Admin |
| DELETE | `/recipes/:id` | Delete recipe | Admin |

## Project Structure

```
server/
├── config/          # Database, Cloudinary, environment, Swagger config
├── controllers/     # Route handler logic
├── middlewares/      # Auth, error handling, rate limiting, upload, validation
├── models/          # Mongoose schemas (User, Recipe)
├── routes/          # Express route definitions with Swagger annotations
├── utils/           # Token generation, helpers, seed script
├── validators/      # express-validator rule sets
└── index.js         # Application entry point
```

## Developer

**Serkanby**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Contact

- [Open an Issue](https://github.com/Serkanbyx/s4.8_Recipe-Mern/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

## License

[MIT](./LICENSE) &copy; 2026 Serkanby
