# 🍳 Recipe MERN

A full-stack recipe sharing platform built with the **MERN** stack (MongoDB, Express, React, Node.js). Create, share, and discover delicious recipes with a modern, responsive interface featuring JWT authentication, role-based access control, Cloudinary image uploads, and a comprehensive admin dashboard.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

---

## Features

- **User Authentication** — Secure register and login system with JWT-based token authentication
- **Role-Based Access Control** — Guest, User, and Admin roles with granular permission management
- **Recipe CRUD** — Create, read, update, and delete recipes with rich, dynamic forms
- **Image Upload** — Cloudinary integration with auto-crop, compression, and MIME validation
- **Search & Filter** — Full-text search, category filtering, difficulty filter, and multiple sort options
- **Favorites System** — Save recipes to a personal collection with toggle functionality
- **Like System** — Like/unlike recipes with optimistic UI updates
- **Drag & Drop** — Reorder ingredients and recipe steps with @dnd-kit sortable lists
- **Admin Dashboard** — User management, recipe moderation, and platform statistics overview
- **Public Profiles** — View user profiles with privacy settings and recipe listings
- **Preferences** — Theme (light/dark/system), font size, content density, and animation toggles
- **Settings Panel** — Tabbed settings with profile, account, appearance, and privacy sections
- **Responsive Design** — Mobile-first layout that works seamlessly on all devices
- **Skeleton Loading** — Smooth loading states with skeleton placeholders for cards and detail pages

---

## Live Demo

[🚀 View Live Demo](https://recipe-mernn.netlify.app/)

---

## Technologies

### Frontend

- **React 19** — Modern UI library with hooks, context, and functional components
- **Vite 8** — Lightning-fast build tool and dev server with HMR
- **Tailwind CSS 4** — Utility-first CSS framework with CSS-first configuration (@theme)
- **React Router 7** — Client-side routing with nested layouts and route guards
- **Axios** — Promise-based HTTP client with request/response interceptors
- **@dnd-kit** — Accessible drag-and-drop toolkit for sortable ingredient and step lists
- **Lucide React** — Beautiful, consistent icon library
- **react-hot-toast** — Lightweight toast notifications with customizable styling

### Backend

- **Node.js** — Server-side JavaScript runtime
- **Express 5** — Minimal and flexible web application framework
- **MongoDB (Mongoose 9)** — NoSQL database with elegant object data modeling
- **JWT (jsonwebtoken)** — Stateless authentication with token-based sessions
- **bcryptjs** — Secure password hashing with salt rounds
- **Cloudinary + Multer** — Cloud-based image upload, storage, and transformation
- **express-validator** — Declarative input validation and sanitization middleware
- **Helmet** — Security HTTP headers middleware
- **express-rate-limit** — Rate limiting for API abuse prevention

---

## Installation

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** — MongoDB Atlas (free tier) or local instance
- **Cloudinary** — Free account at [cloudinary.com](https://cloudinary.com)

### Local Development

**1. Clone the repository:**

```bash
git clone https://github.com/Serkanbyx/s4.8_Recipe-Mern.git
cd s4.8_Recipe-Mern
```

**2. Set up environment variables:**

```bash
cp server/.env.example server/.env
```

**server/.env**

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**client/.env**

```env
VITE_API_URL=http://localhost:5000/api
```

**3. Install dependencies:**

```bash
cd server && npm install
cd ../client && npm install
```

**4. Seed admin user:**

```bash
cd server && npm run seed
```

**5. Run the application:**

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

### Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to **Dashboard** → copy **Cloud Name**, **API Key**, **API Secret**
3. Add the values to `server/.env`

---

## Usage

1. **Browse Recipes** — Visit the homepage to explore all recipes by category, difficulty, or search keywords
2. **Register** — Create a new account with name, email, and password
3. **Login** — Sign in to access authenticated features
4. **Create Recipe** — Fill in the recipe form with title, description, ingredients, steps, image, category, difficulty, and prep/cook time
5. **Manage Recipes** — Edit or delete your own recipes from the "My Recipes" page
6. **Like & Favorite** — Like recipes and save them to your favorites collection
7. **Customize Settings** — Change your profile info, password, theme preferences, and privacy settings
8. **Admin Panel** — Access the admin dashboard (admin role) to manage users and moderate recipes

---

## How It Works?

### Authentication Flow

The application uses JWT-based stateless authentication. On login/register, the server generates a signed JWT token and returns it to the client. The Axios instance attaches this token to every subsequent request via a request interceptor. On 401 responses, the response interceptor clears local storage and redirects to the login page.

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Authorization Middleware

The backend uses three middleware layers for access control:

- **protect** — Verifies JWT token, attaches user to `req.user`
- **optionalAuth** — Attaches user if token is present, otherwise sets `req.user = null`
- **adminOnly** — Checks `req.user.role === 'admin'` for admin-only routes

### Data Flow

1. **Client** → Axios service functions call the REST API
2. **Server** → Express routes validate input via `express-validator`, then delegate to controllers
3. **Controllers** → Execute business logic using Mongoose models
4. **Database** → MongoDB stores Users and Recipes with referenced relationships (likes, favorites, author)

---

## Roles & Permissions

| Action             | Guest | User | Admin |
| ------------------ | ----- | ---- | ----- |
| View recipes       | ✅     | ✅    | ✅     |
| Search & filter    | ✅     | ✅    | ✅     |
| Register / Login   | ✅     | —    | —     |
| Create recipe      | —     | ✅    | ✅     |
| Edit own recipe    | —     | ✅    | ✅     |
| Delete own recipe  | —     | ✅    | ✅     |
| Like recipes       | —     | ✅    | ✅     |
| Favorite recipes   | —     | ✅    | ✅     |
| Edit any recipe    | —     | —    | ✅     |
| Delete any recipe  | —     | —    | ✅     |
| Manage users       | —     | —    | ✅     |
| View dashboard     | —     | —    | ✅     |

---

## API Endpoints

### Auth

| Method | Endpoint              | Auth     | Description             |
| ------ | --------------------- | -------- | ----------------------- |
| POST   | `/api/auth/register`  | No       | Create a new user       |
| POST   | `/api/auth/login`     | No       | Login and receive JWT   |
| GET    | `/api/auth/me`        | Yes      | Get current user        |
| GET    | `/api/auth/users/:id` | Optional | Get public user profile |
| PUT    | `/api/auth/profile`   | Yes      | Update profile          |
| PUT    | `/api/auth/password`  | Yes      | Change password         |
| PUT    | `/api/auth/preferences` | Yes    | Update preferences      |
| DELETE | `/api/auth/account`   | Yes      | Delete account          |

### Recipes

| Method | Endpoint               | Auth         | Description                             |
| ------ | ---------------------- | ------------ | --------------------------------------- |
| GET    | `/api/recipes`         | No           | List recipes (search, filter, sort, paginate) |
| GET    | `/api/recipes/my`      | Yes          | List own recipes                        |
| GET    | `/api/recipes/slug/:slug` | No        | Get recipe by slug                      |
| GET    | `/api/recipes/:id`     | No           | Get recipe by ID                        |
| POST   | `/api/recipes`         | Yes          | Create recipe                           |
| PUT    | `/api/recipes/:id`     | Yes (owner/admin) | Update recipe                      |
| DELETE | `/api/recipes/:id`     | Yes (owner/admin) | Delete recipe                      |
| PUT    | `/api/recipes/:id/like`| Yes          | Toggle like                             |
| POST   | `/api/recipes/upload`  | Yes          | Upload recipe image                     |

### Favorites

| Method | Endpoint                       | Auth | Description           |
| ------ | ------------------------------ | ---- | --------------------- |
| GET    | `/api/favorites`               | Yes  | List favorites        |
| PUT    | `/api/favorites/:recipeId`     | Yes  | Toggle favorite       |
| GET    | `/api/favorites/check/:recipeId` | Yes | Check if favorited  |

### Admin

| Method | Endpoint                      | Auth  | Description         |
| ------ | ----------------------------- | ----- | ------------------- |
| GET    | `/api/admin/dashboard`        | Admin | Dashboard stats     |
| GET    | `/api/admin/users`            | Admin | List all users      |
| GET    | `/api/admin/users/:id`        | Admin | Get user details    |
| PUT    | `/api/admin/users/:id/role`   | Admin | Change user role    |
| DELETE | `/api/admin/users/:id`        | Admin | Delete user         |
| GET    | `/api/admin/recipes`          | Admin | List all recipes    |
| DELETE | `/api/admin/recipes/:id`      | Admin | Delete recipe       |

> All authenticated endpoints require `Authorization: Bearer <token>` header.

---

## Project Structure

```
s4.8_Recipe-Mern/
├── client/                              # React frontend
│   ├── public/
│   │   ├── _redirects                   # Netlify SPA redirect rules
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── guards/                  # Route protection components
│   │   │   │   ├── AdminRoute.jsx       # Admin-only route guard
│   │   │   │   ├── GuestOnlyRoute.jsx   # Guest-only route guard
│   │   │   │   └── ProtectedRoute.jsx   # Auth-required route guard
│   │   │   ├── layout/                  # Layout shells
│   │   │   │   ├── AdminLayout.jsx      # Admin section layout
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── MainLayout.jsx       # Default app layout
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── SettingsLayout.jsx   # Settings tabbed layout
│   │   │   ├── recipe/                  # Recipe-specific components
│   │   │   │   ├── CategoryFilter.jsx
│   │   │   │   ├── IngredientForm.jsx   # Dynamic ingredient form with DnD
│   │   │   │   ├── RecipeCard.jsx
│   │   │   │   ├── RecipeGrid.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── StepForm.jsx         # Dynamic step form with DnD
│   │   │   └── ui/                      # Reusable UI components
│   │   │       ├── CharacterCounter.jsx
│   │   │       ├── ConfirmModal.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── Pagination.jsx
│   │   │       ├── RecipeCardSkeleton.jsx
│   │   │       ├── RecipeDetailSkeleton.jsx
│   │   │       ├── RoleBadge.jsx
│   │   │       ├── ScrollToTop.jsx
│   │   │       ├── SelectableCard.jsx
│   │   │       ├── Spinner.jsx
│   │   │       ├── StatusBadge.jsx
│   │   │       └── ToggleSwitch.jsx
│   │   ├── contexts/                    # React context providers
│   │   │   ├── AuthContext.jsx          # Auth state management
│   │   │   └── PreferencesContext.jsx   # Theme/font/density preferences
│   │   ├── hooks/                       # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useDebounce.js
│   │   │   ├── useLocalStorage.js
│   │   │   └── usePreferences.js
│   │   ├── pages/                       # Route pages
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   ├── AdminUsersPage.jsx
│   │   │   │   └── AdminRecipesPage.jsx
│   │   │   ├── user/
│   │   │   │   └── ProfilePage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── RecipeDetailPage.jsx
│   │   │   ├── CreateRecipePage.jsx
│   │   │   ├── EditRecipePage.jsx
│   │   │   ├── MyRecipesPage.jsx
│   │   │   ├── FavoritesPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/                    # API client and service layer
│   │   │   ├── api.js                   # Axios instance with interceptors
│   │   │   ├── authService.js
│   │   │   ├── recipeService.js
│   │   │   ├── favoriteService.js
│   │   │   ├── adminService.js
│   │   │   └── userService.js
│   │   ├── utils/                       # Client helpers and constants
│   │   │   └── constants.js             # Categories, difficulties, sort options
│   │   ├── App.jsx                      # Root component with routing
│   │   ├── main.jsx                     # React DOM entry point
│   │   └── index.css                    # Tailwind v4 imports and theme tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                              # Express backend
│   ├── config/
│   │   ├── db.js                        # MongoDB connection
│   │   ├── env.js                       # Centralized env loading/validation
│   │   └── cloudinary.js               # Cloudinary SDK configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── recipeController.js
│   │   ├── favoriteController.js
│   │   └── adminController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js            # JWT protect, optionalAuth, adminOnly
│   │   ├── errorHandler.js             # Global error handler
│   │   ├── rateLimiter.js              # Global and route-specific rate limits
│   │   ├── upload.js                   # Multer + Cloudinary upload config
│   │   └── validate.js                 # express-validator result handler
│   ├── models/
│   │   ├── User.js                      # User schema with preferences
│   │   └── Recipe.js                    # Recipe schema with slug, likes
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── recipeRoutes.js
│   │   ├── favoriteRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateToken.js            # JWT sign helper
│   │   ├── helpers.js                  # Regex escape, Cloudinary delete
│   │   └── seed.js                     # Admin user seed script
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── recipeValidator.js
│   │   ├── favoriteValidator.js
│   │   └── adminValidator.js
│   ├── index.js                         # App entry: middleware + routes
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## Security

- **JWT Authentication** — Secure token-based auth with strong secret enforcement and configurable expiry
- **Password Hashing** — bcryptjs with salt rounds for secure password storage
- **Rate Limiting** — Global and route-specific rate limits (auth, upload, like, admin) to prevent abuse
- **Input Validation** — Server-side validation and sanitization with express-validator on all routes
- **NoSQL Injection Prevention** — express-mongo-sanitize strips MongoDB operators from user input
- **XSS Prevention** — Escaped output combined with React's default JSX sanitization
- **CORS Strict Origin** — Whitelist-based CORS configuration allowing only the client origin
- **Helmet Security Headers** — Sets secure HTTP headers (CSP, X-Frame-Options, HSTS, etc.)
- **HPP Protection** — HTTP Parameter Pollution prevention middleware
- **File Upload Validation** — MIME type whitelist and file size limits on Multer uploads
- **Owner/Admin Authorization** — Server-side ownership checks before edit/delete operations
- **x-powered-by Disabled** — Removes Express fingerprinting header

---

## Deployment

### Backend (Render)

1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository and set root directory to `server`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Set environment variables:

| Variable               | Value                           |
| ---------------------- | ------------------------------- |
| `NODE_ENV`             | `production`                    |
| `PORT`                 | `5000`                          |
| `MONGO_URI`            | Your MongoDB Atlas URI          |
| `JWT_SECRET`           | A strong random secret key      |
| `JWT_EXPIRES_IN`       | `7d`                            |
| `CORS_ORIGIN`          | `https://recipe-mernn.netlify.app` |
| `CLOUDINARY_CLOUD_NAME`| Your Cloudinary cloud name      |
| `CLOUDINARY_API_KEY`   | Your Cloudinary API key         |
| `CLOUDINARY_API_SECRET`| Your Cloudinary API secret      |

### Frontend (Netlify)

1. Create a new site on [Netlify](https://netlify.com)
2. Connect your GitHub repository and set base directory to `client`
3. **Build command:** `npm run build`
4. **Publish directory:** `dist`
5. Add `_redirects` file in `public/`: `/* /index.html 200`
6. Set environment variable:

| Variable       | Value                              |
| -------------- | ---------------------------------- |
| `VITE_API_URL` | Your Render backend URL + `/api`   |

> Make sure the backend `CORS_ORIGIN` matches your Netlify domain exactly.

---

## Features in Detail

### Completed Features

✅ User registration and login with JWT authentication
✅ Full recipe CRUD with image upload (Cloudinary)
✅ Category filtering (Breakfast, Main Course, Dessert, Beverage, Snack, Soup, Salad)
✅ Difficulty filtering (Easy, Medium, Hard)
✅ Full-text search with debounced input
✅ Sort by newest, oldest, most popular, quickest
✅ Pagination with page navigation
✅ Like/unlike with optimistic updates
✅ Favorites collection with toggle
✅ Drag-and-drop reordering for ingredients and steps
✅ Public user profiles with privacy settings
✅ Settings page with profile, account, appearance, and privacy tabs
✅ Theme support (light, dark, system)
✅ Font size and content density preferences
✅ Admin dashboard with statistics
✅ Admin user management (role change, delete)
✅ Admin recipe moderation
✅ Skeleton loading states
✅ Responsive mobile-first design
✅ Comprehensive security hardening

---

## Contributing

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to the branch: `git push origin feat/amazing-feature`
5. **Open** a Pull Request

### Commit Message Format

| Prefix      | Description                        |
| ----------- | ---------------------------------- |
| `feat:`     | New feature                        |
| `fix:`      | Bug fix                            |
| `refactor:` | Code refactoring                   |
| `docs:`     | Documentation changes              |
| `style:`    | Styling and formatting changes     |
| `chore:`    | Maintenance and dependency updates |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Developer

**Serkan Bayraktar**

- 🌐 [serkanbayraktar.com](https://serkanbayraktar.com/)
- 🐙 [GitHub — @Serkanbyx](https://github.com/Serkanbyx)
- 📧 [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

---

## Contact

- 🐛 [Open an Issue](https://github.com/Serkanbyx/s4.8_Recipe-Mern/issues)
- 📧 [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- 🌐 [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
