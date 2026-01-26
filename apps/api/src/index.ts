import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { auth } from './lib/auth';
import userController from './controller/userController';
import learningController from './controller/learningController';
import dashboardController from './controller/dashboardController';
import { vocabularyController } from './controller/vocabularyController';
import { globalRateLimiter, authRateLimiter } from './middleware/rateLimiter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Hono().basePath('/api');

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);

const corsConfig = {
  origin: (origin: string) => {
    if (!origin) return null;
    if (allowedOrigins.includes(origin)) {
      return origin; // MUST return string
    }
    return null; // deny
  },
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  exposeHeaders: ['Content-Length', 'Set-Cookie'],
  maxAge: 600
};

const csrfProtection = csrf({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
});

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

// Rate limiters
app.use('*', async (c, next) => {
  try {
    return await globalRateLimiter(c, next);
  } catch (e) {
    console.error('Global rate limiter error:', e);
    return c.text('Service unavailable', 503);
  }
});

app.use('/auth/*', async (c, next) => {
  try {
    return await authRateLimiter(c, next);
  } catch (e) {
    console.error('Auth rate limiter error:', e);
    return c.text('Service unavailable', 503);
  }
});

// CORS
app.use('/auth/*', cors(corsConfig));
app.use('/*', cors(corsConfig));

// CSRF (skip auth)
app.use('/*', async (c, next) => {
  if (c.req.path.startsWith('/api/auth')) {
    return next();
  }
  return csrfProtection(c, next);
});

// Better-Auth
app.on(['POST', 'GET'], '/auth/**', async (c) => {
  return await auth.handler(c.req.raw);
});

// Routes
app.route('/users', userController);
app.route('/learn', learningController);
app.route('/dashboard', dashboardController);
app.route('/vocabulary', vocabularyController);

// Static uploads
if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/uploads/*',
    serveStatic({
      root: path.join(__dirname, '../public')
    })
  );
}

const port = Number(process.env.PORT) || 3000;
console.log(`API running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

export default app;
