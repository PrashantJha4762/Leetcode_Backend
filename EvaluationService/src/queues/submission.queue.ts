import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis.config";
import { logger } from "../config/logger.config";

export const submissionqueue= new Queue("submission",{
    connection:createRedisConnection(),
    defaultJobOptions:{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:2000
        }
    }
})
submissionqueue.on("error", (error) => {
    logger.error(`Submission queue error: ${error}`);
});

submissionqueue.on("waiting", (job) => {
    logger.info(`Submission job waiting: ${job.id}`);
});