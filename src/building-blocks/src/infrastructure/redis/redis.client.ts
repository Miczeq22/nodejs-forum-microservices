import { createClient } from 'redis';

export const redisClient = (url: string) =>
  createClient({
    url,
  });
