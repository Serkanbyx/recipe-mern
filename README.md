# RecipeApp — Recipe Sharing Platform

A full-stack recipe sharing platform built with the MERN stack. Create, share, and discover delicious recipes with a modern, responsive interface.

## Features

- **User Authentication:** Register, login, JWT-based auth, role-based access control
- **Recipe Management:** Create, edit, delete recipes with rich forms
- **Image Upload:** Cloudinary integration for recipe images with auto-crop and compression
- **Search & Filter:** Full-text search, category filtering, difficulty filter, multiple sort options
- **Favorites:** Save recipes to personal collection
- **Likes:** Like/unlike recipes with optimistic updates
- **Dynamic Forms:** Add/remove ingredients and steps dynamically with drag-and-drop reordering
- **Admin Dashboard:** User management, recipe moderation, statistics
- **User Profiles:** Public profiles with privacy settings
- **Preferences:** Theme (light/dark/system), font size, content density, animations
- **Responsive Design:** Mobile-first, works on all devices

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TailwindCSS v4, React Router v7 |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose v9 |
| Auth | JWT, bcryptjs |
| Images | Cloudinary, Multer |
| DnD | @dnd-kit |
| Icons | Lucide React |
| Notifications | react-hot-toast |

## Roles & Permissions

| Action | Guest | User | Admin |
|--------|-------|------|-------|
| View recipes | ✅ | ✅ | ✅ |
| Search & filter | ✅ | ✅ | ✅ |
| Register/login | ✅ | — | — |
| Create recipe | — | ✅ | ✅ |
| Edit own recipe | — | ✅ | ✅ |
| Delete own recipe | — | ✅ | ✅ |
| Like recipes | — | ✅ | ✅ |
| Favorite recipes | — | ✅ | ✅ |
| Edit any recipe | — | — | ✅ |
| Delete any recipe | — | — | ✅ |
| Manage users | — | — | ✅ |
| View dashboard | — | — | ✅ |

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |
| GET | /api/auth/users/:userId | Get public profile | Optional |
| PUT | /api/auth/profile | Update profile | Yes |
| PUT | /api/auth/password | Change password | Yes |
| PUT | /api/auth/preferences | Update preferences | Yes |
| DELETE | /api/auth/account | Delete account | Yes |

### Recipes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/recipes | List recipes (search, filter, sort, paginate) | No |
| GET | /api/recipes/my | List own recipes | Yes |
| GET | /api/recipes/slug/:slug | Get recipe by slug | No |
| GET | /api/recipes/:id | Get recipe by ID | No |
| POST | /api/recipes | Create recipe | Yes |
| PUT | /api/recipes/:id | Update recipe | Yes (owner/admin) |
| DELETE | /api/recipes/:id | Delete recipe | Yes (owner/admin) |
| PUT | /api/recipes/:id/like | Toggle like | Yes |
| POST | /api/recipes/upload | Upload image | Yes |

### Favorites
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/favorites | List favorites | Yes |
| PUT | /api/favorites/:recipeId | Toggle favorite | Yes |
| GET | /api/favorites/check/:recipeId | Check if favorited | Yes |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/admin/dashboard | Dashboard stats | Admin |
| GET | /api/admin/users | List all users | Admin |
| GET | /api/admin/users/:id | Get user details | Admin |
| PUT | /api/admin/users/:id/role | Change user role | Admin |
| DELETE | /api/admin/users/:id | Delete user | Admin |
| GET | /api/admin/recipes | List all recipes | Admin |
| DELETE | /api/admin/recipes/:id | Delete recipe | Admin |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier)

### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```
4. Create `server/.env` (see `.env.example`)
5. Seed admin user:
   ```bash
   cd server
   npm run seed
   ```
6. Start development:
   ```bash
   # Terminal 1 - Server
   cd server && npm run dev

   # Terminal 2 - Client
   cd client && npm run dev
   ```

### Cloudinary Setup
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Add to `server/.env`

## Security

- JWT authentication with strong secret enforcement
- bcrypt password hashing (12 salt rounds)
- Rate limiting per route group
- Input validation & sanitization (express-validator)
- NoSQL injection prevention (express-mongo-sanitize)
- XSS prevention (escape + React default JSX)
- CORS strict origin
- Helmet security headers
- HPP (HTTP parameter pollution) protection
- File upload validation (MIME whitelist, size limit)
- Owner/admin authorization checks

## Deployment

### Backend (Render)
1. Create Web Service on Render
2. Set environment variables (NODE_ENV=production, etc.)
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend (Netlify)
1. Create site on Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add `_redirects` file: `/* /index.html 200`
5. Set `VITE_API_URL` env variable to backend URL

## License

MIT
