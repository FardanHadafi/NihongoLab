import { Hono } from 'hono';
import { DashboardService } from '../service/dashboardService';
import { authMiddleware } from '../middleware/auth.middleware';

const dashboardController = new Hono();
const service = new DashboardService();

dashboardController.get('/', authMiddleware, async (c) => {
  const user = c.get('user'); // from better-auth middleware

  const data = await service.getDashboard(user.id);

  return c.json(data);
});

export default dashboardController;
