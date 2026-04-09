import Redis from "ioredis";
import config, { getRedisConnection } from "../config";
import Logger from "../utils/logger";

let redis: Redis | null = null;

if (config.redis.host && config.redis.port) {
  try {
    const connectionOptions = getRedisConnection();
    
    redis = new Redis({
      ...connectionOptions,
      retryStrategy: (times) => {
        if (times > 3) return null; // stop retrying after 3 times
        return Math.min(times * 50, 2000);
      },
    });

    redis.on("error", (err) => {
      Logger.error("Redis Cache Error:", err);
      redis = null; // Fallback to in-memory on connection error
    });
  } catch (error) {
    Logger.error("Failed to initialize Redis:", error);
  }
}

// Fallback In-memory cache
const memoryCache = new Map<string, { value: string; expiry: number }>();

export const buildCacheKey = (api_name: string, status_code: number, anomalyType: string): string => {
  return `ai_cache:${api_name}:${status_code}:${anomalyType}`;
};

export const getCachedResponse = async (key: string): Promise<string | null> => {
  try {
    if (redis) {
      const value = await redis.get(key);
      if (value) {
        Logger.info(`Cache HIT: ${key}`);
        return value;
      }
    } else {
      const cached = memoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        Logger.info(`In-Memory Cache HIT: ${key}`);
        return cached.value;
      }
      if (cached) memoryCache.delete(key); // Cleanup expired
    }
    Logger.info(`Cache MISS: ${key}`);
    return null;
  } catch (error) {
    Logger.error("Cache Get Error:", error);
    return null;
  }
};

export const setCachedResponse = async (key: string, value: string, ttl: number): Promise<void> => {
  try {
    if (redis) {
      await redis.set(key, value, "EX", ttl);
    } else {
      memoryCache.set(key, {
        value,
        expiry: Date.now() + ttl * 1000,
      });
    }
  } catch (error) {
    Logger.error("Cache Set Error:", error);
  }
};
