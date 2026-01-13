import { authMiddleware } from '@/middleware/auth.middleware';
import { UserService } from '@/service/userService';
import { Hono } from 'hono';
import { updateSchema } from '@nihongolab/db';
import { zValidator } from '@hono/zod-validator';

const userController = new Hono();
const userService = new UserService();

// Apply Auth Middleware to ALL routes in this file
userController.use('*', authMiddleware);

// GET /api/users/me
userController.get('/me', async (c) => {
  const user = c.get('user');
  const profile = await userService.getProfile(user.id);
  return c.json(profile);
});

// PATCH /api/users/me
userController.patch('/me', zValidator('json', updateSchema), async (c) => {
  const user = c.get('user');
  const data = c.req.valid('json');

  const updatedUser = await userService.updateProfile(user.id, data);

  if (!updatedUser) {
    return c.json({ error: 'Update failed' }, 400);
  }

  return c.json(updatedUser);
});

export default userController;
