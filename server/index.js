import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import sanitizeMongo from './middlewares/sanitize.js';
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
app.use(sanitizeMongo);
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

    @keyframes steam {
      0%   { transform: translateY(0) scaleX(1); opacity: 0.4; }
      50%  { transform: translateY(-18px) scaleX(1.3); opacity: 0.15; }
      100% { transform: translateY(-36px) scaleX(0.8); opacity: 0; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-8px); }
    }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #fdf5ed;
      background-image:
        radial-gradient(ellipse 90% 70% at 15% 5%, rgba(234,88,12,0.10) 0%, transparent 55%),
        radial-gradient(ellipse 70% 60% at 85% 90%, rgba(220,38,38,0.07) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(245,158,11,0.05) 0%, transparent 65%),
        repeating-conic-gradient(rgba(180,83,9,0.015) 0% 25%, transparent 0% 50%) 0 0 / 60px 60px;
      overflow: hidden;
      position: relative;
    }

    body::before {
      content: '';
      position: fixed;
      top: -80px;
      right: -80px;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 65%);
      pointer-events: none;
    }

    body::after {
      content: '';
      position: fixed;
      bottom: -60px;
      left: -60px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 65%);
      pointer-events: none;
    }

    .plate-deco {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      border: 2px dashed rgba(180,83,9,0.06);
    }
    .plate-deco--1 { width: 140px; height: 140px; top: 8%; left: 5%; }
    .plate-deco--2 { width: 100px; height: 100px; bottom: 12%; right: 8%; border-style: dotted; border-color: rgba(234,88,12,0.05); }
    .plate-deco--3 { width: 60px; height: 60px; top: 60%; left: 85%; border-color: rgba(245,158,11,0.07); }

    .container {
      text-align: center;
      padding: 2.8rem 2.5rem 2.2rem;
      max-width: 460px;
      width: 90%;
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(16px) saturate(1.4);
      border-radius: 28px;
      border: 1px solid rgba(234,88,12,0.12);
      box-shadow:
        0 12px 48px rgba(180,83,9,0.08),
        0 2px 6px rgba(0,0,0,0.03),
        inset 0 1px 0 rgba(255,255,255,0.6);
      position: relative;
      z-index: 1;
    }

    .container::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 50%;
      height: 3px;
      border-radius: 0 0 8px 8px;
      background: linear-gradient(90deg, transparent, #ea580c, #f59e0b, #ea580c, transparent);
    }

    .icon-wrap {
      position: relative;
      display: inline-block;
      margin-bottom: 0.6rem;
      animation: float 4s ease-in-out infinite;
    }

    .icon-wrap::before,
    .icon-wrap::after,
    .icon-wrap .steam {
      content: '';
      position: absolute;
      width: 6px;
      height: 14px;
      border-radius: 50%;
      background: rgba(180,83,9,0.15);
      animation: steam 2.2s ease-out infinite;
    }
    .icon-wrap::before { top: -8px; left: 35%; animation-delay: 0s; }
    .icon-wrap::after  { top: -10px; left: 55%; animation-delay: 0.7s; }
    .icon-wrap .steam   { top: -6px; left: 45%; animation-delay: 1.4s; }

    .icon {
      font-size: 3rem;
      display: block;
      filter: drop-shadow(0 3px 8px rgba(200,80,20,0.18));
    }

    h1 {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #c2410c 0%, #dc2626 50%, #b45309 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.25rem;
    }

    .version {
      font-size: 0.82rem;
      color: #b45309;
      font-weight: 600;
      letter-spacing: 1.5px;
      margin-bottom: 1.8rem;
      opacity: 0.7;
      text-transform: uppercase;
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      margin-bottom: 1.8rem;
    }

    .btn-primary, .btn-secondary {
      display: inline-block;
      padding: 0.85rem 1.6rem;
      border-radius: 16px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      letter-spacing: 0.3px;
      position: relative;
      overflow: hidden;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ea580c, #dc2626);
      color: #fff;
      box-shadow: 0 4px 16px rgba(220,60,30,0.25), inset 0 1px 0 rgba(255,255,255,0.15);
    }
    .btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .btn-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 24px rgba(220,60,30,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
    }
    .btn-primary:hover::after { opacity: 1; }

    .btn-secondary {
      background: rgba(255,255,255,0.85);
      color: #c2410c;
      border: 1.5px solid rgba(194,65,12,0.18);
      box-shadow: 0 2px 8px rgba(180,83,9,0.04);
    }
    .btn-secondary:hover {
      background: rgba(234,88,12,0.04);
      border-color: rgba(194,65,12,0.4);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 6px 18px rgba(180,83,9,0.08);
    }

    .divider {
      width: 40px;
      height: 2px;
      margin: 0 auto 1.2rem;
      background: linear-gradient(90deg, transparent, rgba(180,83,9,0.2), transparent);
      border-radius: 2px;
    }

    .sign {
      font-size: 0.8rem;
      color: #92400e;
      opacity: 0.65;
      line-height: 1.6;
    }
    .sign a {
      color: #c2410c;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .sign a:hover {
      color: #9a3412;
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .container { padding: 2rem 1.5rem 1.6rem; border-radius: 22px; }
      h1 { font-size: 1.5rem; }
      .icon { font-size: 2.6rem; }
      .plate-deco { display: none; }
    }
  </style>
</head>
<body>
  <div class="plate-deco plate-deco--1"></div>
  <div class="plate-deco plate-deco--2"></div>
  <div class="plate-deco plate-deco--3"></div>

  <div class="container">
    <div class="icon-wrap">
      <span class="steam"></span>
      <span class="icon" aria-hidden="true">&#127858;</span>
    </div>
    <h1>Recipe MERN API</h1>
    <p class="version">v${version}</p>
    <div class="links">
      <a href="/api-docs" class="btn-primary">API Documentation</a>
      <a href="/api/health" class="btn-secondary">Health Check</a>
    </div>
    <div class="divider"></div>
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
