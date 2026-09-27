import Redis from "ioredis";
import { logger } from "./logger.config";

const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
};

export const redis = new Redis(redisConfig);

redis.on("connect", () => {
    logger.info("Successfully connected to Redis");
});

redis.on("error", (error: Error) => {
    logger.error("Something went wrong with Redis connection", error);
});

export const createRedisConnection = () => {
    return new Redis(redisConfig);
};

export const createNewRedisConnection = createRedisConnection;

export default redis;