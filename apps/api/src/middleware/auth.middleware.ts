import { auth } from '@/lib/auth';
import { Context, Next } from 'hono';

export const authMiddleware = async (c: Context, next: Next) => {
  // Better-Auth reads the headers/cookies automatically
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  });

  if (!session) {
    return c.json(
      {
        error: 'Unauthorized'
      },
      401
    );
  }

  // Attach user/session to context so Controllers can use it
  c.set('user', session.user);
  c.set('session', session.session);
  await next();
};

// Type Definition for Hono to know "user" exist in Context
type Variables = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};

declare module 'hono' {
  interface ContextVariableMap extends Variables {}
}
