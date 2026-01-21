import 'dotenv/config';
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

const app = new Hono().basePath('/api');

// CORS for auth routes - Path is relative to basePath, so just '/auth/*'
app.use(
  '/auth/*',
  cors({
    origin: 'http://localhost:5173',
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
  if (c.req.path.startsWith('/auth')) {
    return next();
  }

  // Apply CSRF to other routes
  return csrf({
    origin: 'http://localhost:5173'
  })(c, next);
});

// Better-Auth Controller (handles /api/auth/*)
app.on(['POST', 'GET'], '/auth/**', (c) => {
  return auth.handler(c.req.raw);
});

// User Controller & Learning Controller
app.route('/users', userController); // /api/users/me
app.route('/learn', learningController); // /api/learn/submit
app.route('/dashboard', dashboardController);
app.route('/vocabulary', vocabularyController);

// Upload Image
app.use('/uploads/*', serveStatic({ root: './public' }));

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

export default app;
