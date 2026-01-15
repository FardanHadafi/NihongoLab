import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './lib/auth';
import userController from './controller/userController';
import learningController from './controller/learningController';
import { serve } from '@hono/node-server';

const app = new Hono().basePath('/api');

// Global Middleware
app.use('*', cors());
// Better-Auth Controller (handles /api/auth/*)
app.on(['POST', 'GET'], '/auth/**', (c) => {
  return auth.handler(c.req.raw);
});
// User Controller & Learning Controller
app.route('/users', userController); // /api/users/me
app.route('/learn', learningController); // /api/learn/submit

const port = 3000;
console.log(`Server is running on port ${port}`);
serve({
  fetch: app.fetch,
  port
});
export default app;
