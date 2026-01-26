import RedisPkg from 'ioredis';
const Redis = (RedisPkg as any).default || RedisPkg;

// Singleton pattern for Redis client
let redisClient: any = null;

export function getRedisClient(): any {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err: Error) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          // Reconnect when Redis is in READONLY mode
          return true;
        }
        return false;
      }
    });

    // Add scriptLoad shim for ioredis (used by @hono-rate-limiter/redis)
    if (typeof redisClient.scriptLoad !== 'function') {
      redisClient.scriptLoad = function (script: string) {
        return this.script('load', script);
      };
    }

    redisClient.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });
  }

  return redisClient;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

// Cache helper functions
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);

    if (ttl) {
      await client.setex(key, ttl, serialized);
    } else {
      await client.set(key, serialized);
    }
  },

  async delete(key: string): Promise<void> {
    const client = getRedisClient();
    await client.del(key);
  },

  async deletePattern(pattern: string): Promise<void> {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  },

  async exists(key: string): Promise<boolean> {
    const client = getRedisClient();
    const result = await client.exists(key);
    return result === 1;
  },

  async ttl(key: string): Promise<number> {
    const client = getRedisClient();
    return await client.ttl(key);
  }
};

export { RedisPkg as Redis };
