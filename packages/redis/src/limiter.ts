import { createClient, type RedisClientType } from 'redis';

let limiterClient: RedisClientType | null = null;

export async function getLimiterRedis(): Promise<RedisClientType> {
  if (!limiterClient) {
    limiterClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    limiterClient.on('error', (err) => {
      console.error('❌ Limiter Redis error:', err);
    });

    await limiterClient.connect();
    console.log('✅ Limiter Redis connected');
  }

  return limiterClient;
}
