import { rateLimiter } from "hono-rate-limiter";
export const globalRateLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) => {
        const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip");
        if (ip)
            return `rate-limit:global:${ip}`;
        return `rate-limit:global:anonymous`;
    },
});
export const authRateLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, // Strict limit for auth routes
    standardHeaders: "draft-7",
    keyGenerator: (c) => {
        const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip");
        if (ip)
            return `rate-limit:auth:${ip}`;
        return `rate-limit:auth:anonymous`;
    },
});
