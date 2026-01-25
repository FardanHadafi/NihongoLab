import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

import { auth } from './lib/auth';

import userController from './controller/userController';
import learningController from './controller/learningController';
import dashboardController from './controller/dashboardController';
import { vocabularyController } from './controller/vocabularyController';

import { globalRateLimiter, authRateLimiter } from './middleware/rateLimiter';

// --------------------------------------------------
// App
// --------------------------------------------------
const app = new Hono().basePath('/api');

// --------------------------------------------------
// Environment-aware origin
// --------------------------------------------------
const WEB_ORIGIN = process.env.AUTH_BASE_URL || 'http://localhost:5173';

// --------------------------------------------------
// Rate Limiters
// --------------------------------------------------
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

// --------------------------------------------------
// CORS (Auth routes)
// --------------------------------------------------
app.use(
  '/auth/*',
  cors({
    origin: WEB_ORIGIN,
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS']
  })
);

// --------------------------------------------------
// CORS (Other API routes)
// --------------------------------------------------
app.use(
  '/*',
  cors({
    origin: WEB_ORIGIN,
    credentials: true
  })
);

// --------------------------------------------------
// CSRF (skip Better-Auth routes)
// --------------------------------------------------
app.use('/*', async (c, next) => {
  if (c.req.path.startsWith('/api/auth')) {
    return next();
  }

  return csrf({
    origin: WEB_ORIGIN
  })(c, next);
});

// --------------------------------------------------
// Better-Auth handler
// --------------------------------------------------
app.on(['GET', 'POST'], '/auth/**', async (c) => {
  try {
    return await auth.handler(c.req.raw);
  } catch (error) {
    console.error('Better-Auth error:', error);
    return c.json({ error: 'Authentication internal error' }, 500);
  }
});

// --------------------------------------------------
// API Routes
// --------------------------------------------------
app.route('/users', userController);
app.route('/learn', learningController);
app.route('/dashboard', dashboardController);
app.route('/vocabulary', vocabularyController);

// --------------------------------------------------
// Health check (IMPORTANT for Vercel)
// --------------------------------------------------
app.get('/health', (c) => {
  return c.json({ ok: true });
});

// --------------------------------------------------
// Export ONLY (no server, no port)
// --------------------------------------------------
export default app;
