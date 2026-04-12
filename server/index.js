import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
import connectDB from './config/db.js';
import env from './config/env.js';
import swaggerSpec from './config/swagger.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.disable('x-powered-by');
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(hpp());
app.use(globalLimiter);

// Root — themed welcome page
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recipe MERN API</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #fef6ee;
      background-image:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255,140,50,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 85%, rgba(220,60,40,0.08) 0%, transparent 55%),
        radial-gradient(circle at 50% 50%, rgba(255,200,100,0.06) 0%, transparent 70%);
      overflow: hidden;
      position: relative;
    }

    body::before {
      content: '';
      position: fixed;
      top: -60px;
      right: -60px;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,120,50,0.15) 0%, transparent 70%);
      pointer-events: none;
    }

    body::after {
      content: '';
      position: fixed;
      bottom: -40px;
      left: -40px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(200,50,30,0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .container {
      text-align: center;
      padding: 3rem 2.5rem;
      max-width: 480px;
      width: 90%;
      background: rgba(255,255,255,0.75);
      backdrop-filter: blur(12px);
      border-radius: 24px;
      border: 1px solid rgba(255,160,80,0.2);
      box-shadow:
        0 8px 32px rgba(180,80,20,0.08),
        0 1px 3px rgba(0,0,0,0.04);
      position: relative;
    }

    .container::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 3px;
      border-radius: 0 0 6px 6px;
      background: linear-gradient(90deg, #e8560a, #f59e0b, #e8560a);
    }

    .icon {
      font-size: 2.8rem;
      margin-bottom: 0.5rem;
      display: block;
      filter: drop-shadow(0 2px 6px rgba(200,80,20,0.2));
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #c2410c, #dc2626);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.3rem;
    }

    .version {
      font-size: 0.85rem;
      color: #b45309;
      font-weight: 600;
      letter-spacing: 1px;
      margin-bottom: 2rem;
      opacity: 0.8;
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .btn-primary, .btn-secondary {
      display: inline-block;
      padding: 0.8rem 1.6rem;
      border-radius: 14px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.25s ease;
      letter-spacing: 0.2px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ea580c, #dc2626);
      color: #fff;
      box-shadow: 0 4px 14px rgba(220,60,30,0.25);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(220,60,30,0.35);
    }

    .btn-secondary {
      background: rgba(255,255,255,0.8);
      color: #c2410c;
      border: 1.5px solid rgba(194,65,12,0.25);
    }
    .btn-secondary:hover {
      background: rgba(194,65,12,0.06);
      border-color: rgba(194,65,12,0.45);
      transform: translateY(-2px);
    }

    .sign {
      font-size: 0.8rem;
      color: #92400e;
      opacity: 0.7;
    }
    .sign a {
      color: #c2410c;
      text-decoration: none;
      font-weight: 600;
    }
    .sign a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .container { padding: 2rem 1.5rem; }
      h1 { font-size: 1.4rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <span class="icon" aria-hidden="true">&#127858;</span>
    <h1>Recipe MERN API</h1>
    <p class="version">v${version}</p>
    <div class="links">
      <a href="/api-docs" class="btn-primary">API Documentation</a>
      <a href="/api/health" class="btn-secondary">Health Check</a>
    </div>
    <footer class="sign">
      Created by
      <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
      |
      <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  </div>
</body>
</html>`);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Recipe MERN API Docs',
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Recipe API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    if (env.NODE_ENV !== 'production') {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`API Docs: http://localhost:${env.PORT}/api-docs`);
    }
  });
};

startServer();
