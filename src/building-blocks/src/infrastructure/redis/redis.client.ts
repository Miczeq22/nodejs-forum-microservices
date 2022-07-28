import { createClient, RedisClientType } from 'redis';

export const redisClient = (url: string): RedisClientType =>
  createClient({
    url,
  });
