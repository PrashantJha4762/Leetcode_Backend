import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { startworkers } from './workers/evaluation.worker';
import { pullAllImages } from './utils/containers/pullImage.util';

const app = express();

app.use(express.json());

/**
 * Registering middleware for correlation ID tracking across async operations
 */
app.use(attachCorrelationIdMiddleware);

/**
 * Registering all the routers with our app server object
 */
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

/**
 * Registering error handler middlewares
 */
app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
    logger.info(`Evaluation Service is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);

    try {
        // Start BullMQ workers to process code evaluation jobs from Redis queue
        await startworkers();
        logger.info("Evaluation workers started successfully");
    } catch (err) {
        logger.error("Failed to start evaluation workers:", err);
    }

    try {
        // Pull execution Docker images for Python and C++
        await pullAllImages();
    } catch (err) {
        logger.error("Failed to pull Docker images:", err);
    }
});

export default app;