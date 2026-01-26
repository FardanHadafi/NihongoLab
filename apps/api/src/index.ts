import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module-safe way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the root of the monorepo
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { auth } from './lib/auth';
import userController from './controller/userController';
import learningController from './controller/learningController';
import { serve } from '@hono/node-server';
import dashboardController from './controller/dashboardController';
import { serveStatic } from '@hono/node-server/serve-static';
import { vocabularyController } from './controller/vocabularyController';
import { globalRateLimiter, authRateLimiter } from './middleware/rateLimiter';

const app = new Hono().basePath('/api');

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';


// Rate Limiter
app.use('*', async (c, next) => {
  try {
    return await globalRateLimiter(c, next);
  } catch (error) {
    console.error('Global Rate Limiter error:', error);
    return next();
  }
});
app.use('/auth/*', async (c, next) => {
  try {
    return await authRateLimiter(c, next);
  } catch (error) {
    console.error('Auth Rate Limiter error:', error);
    return next();
  }
});

// CORS for auth routes - Path is relative to basePath, so just '/auth/*'
app.use(
  '/auth/*',
  cors({
    origin: FRONTEND_ORIGIN,
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    exposeHeaders: ['Content-Length', 'Set-Cookie'],
    maxAge: 600,
    credentials: true
  })
);

// CORS for other API routes
app.use(
  '/*',
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    maxAge: 600,
    credentials: true
  })
);

// CSRF Protection - Skip auth routes (Better-Auth has its own protection)
app.use('/*', async (c, next) => {
  // Skip CSRF for auth routes
  // Better-Auth routes are like /api/auth/sign-in/email, and basePath is /api
  // So c.req.path will be /api/auth/sign-in/email
  if (c.req.path.startsWith('/api/auth')) {
    return next();
  }

  // Apply CSRF to other routes
  return csrf({
    origin: FRONTEND_ORIGIN
  })(c, next);
});

// Better-Auth Controller (handles /api/auth/*)
app.on(['POST', 'GET'], '/auth/**', async (c) => {
  try {
    return await auth.handler(c.req.raw);
  } catch (error) {
    console.error('Better-Auth handler error:', error);
    return c.json({ error: 'Authentication internal error' }, 500);
  }
});

// User Controller & Learning Controller
app.route('/users', userController); // /api/users/me
app.route('/learn', learningController); // /api/learn/submit
app.route('/dashboard', dashboardController);
app.route('/vocabulary', vocabularyController);

// Upload Image
app.use(
  '/uploads/*',
  serveStatic({
    root: path.resolve(__dirname, '../public')
  })
);

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
