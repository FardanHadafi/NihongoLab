import { auth } from '@/lib/auth';
export const authMiddleware = async (c, next) => {
    // Better-Auth reads the headers/cookies automatically
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
    });
    if (!session) {
        return c.json({
            error: 'Unauthorized'
        }, 401);
    }
    if (!session.user.emailVerified) {
        return c.json({ error: 'Email not verified' }, 403);
    }
    // Attach user/session to context so Controllers can use it
    c.set('user', session.user);
    c.set('session', session.session);
    await next();
};
