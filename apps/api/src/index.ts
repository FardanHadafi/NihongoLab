import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

import { auth } from './lib/auth';
import userController from './controller/userController';
import learningController from './controller/learningController';
import dashboardController from './controller/dashboardController';
import { vocabularyController } from './controller/vocabularyController';
import { globalRateLimiter, authRateLimiter } from './middleware/rateLimiter';

import { serve } from '@hono/node-server';

const app = new Hono().basePath('/api');

// Rate limiters
app.use('*', async (c, next) => {
  try {
    return await globalRateLimiter(c, next);
  } catch (err) {
    console.error(err);
    return next();
  }
});

app.use('/auth/*', async (c, next) => {
  try {
    return await authRateLimiter(c, next);
  } catch (err) {
    console.error(err);
    return next();
  }
});

// CORS (PRODUCTION)
const WEB_ORIGIN = process.env.AUTH_BASE_URL!;

app.use(
  '/auth/*',
  cors({
    origin: WEB_ORIGIN,
    credentials: true
  })
);

app.use(
  '/*',
  cors({
    origin: WEB_ORIGIN,
    credentials: true
  })
);

// CSRF (skip auth)
app.use('*', async (c, next) => {
  if (c.req.path.startsWith('/api/auth')) return next();

  return csrf({
    origin: WEB_ORIGIN
  })(c, next);
});

// Better-Auth
app.on(['GET', 'POST'], '/auth/**', (c) => {
  return auth.handler(c.req.raw);
});

// Routes
app.get('/', (c) => c.text('API OK'));
app.route('/users', userController);
app.route('/learn', learningController);
app.route('/dashboard', dashboardController);
app.route('/vocabulary', vocabularyController);

if (process.env.NODE_ENV !== 'production') {
  const port = 3000;
  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port
  });
}

export default app;
