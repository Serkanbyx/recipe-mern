import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import connectDB from './config/db.js';
import env from './config/env.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(hpp());
app.use(globalLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Recipe API is running', timestamp: new Date().toISOString() });
});

// Routes will be mounted here in later steps
// app.use('/api/auth', authRoutes);
// app.use('/api/recipes', recipeRoutes);
// app.use('/api/favorites', favoriteRoutes);
// app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
};

startServer();
