import type { NextFunction, Request, Response } from "express";
import type { AppError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export const appErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.StatusCode || err.statusCode;
    if (statusCode) {
        logger.error(`App Error: ${err.message}`, { name: err.name, statusCode });
        res.status(statusCode).json({
            success: false,
            message: err.message,
            data: {},
            error: err
        });
        return;
    }
    next(err);
};

export const genericErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Unhandled Error: ${err.message}`, { error: err });
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        data: {},
        error: err
    });
};

export const GenericErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.StatusCode || err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong"
    });
};