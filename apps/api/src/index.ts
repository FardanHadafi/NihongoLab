import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './lib/auth';
import userController from './controller/userController';
import learningController from './controller/learningController';

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

export default app;
