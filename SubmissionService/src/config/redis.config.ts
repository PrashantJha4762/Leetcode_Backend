import Redis from 'ioredis';
import { logger } from './logger.config';

const redisconfig={
    host:process.env.REDIS_HOST||"localhost",
    port:Number(process.env.REDIS_PORT)||6379,
    maxRetriesPerRequest: null,
    retryStrategy: (times:number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
}

const redis=new Redis(redisconfig)

redis.on("connect",()=>{
    logger.info("Successfully connected to redis")
})

redis.on("error",(error:Error)=>{
    logger.error("Something went wrong with redis",error)
})

export const createRedisConnection=()=>{
    return new Redis(redisconfig) // Create a new Redis connection ,agr khi p zaroori hogi tb use
    //krenge jaise ki queue setup krne m
}