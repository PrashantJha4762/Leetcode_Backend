import { v4 as uuidv4 } from "uuid";
import type { NextFunction, Request, Response } from "express";
import { asynclocalstorage } from "../utils/helpers/request.helpers";

export const attachCorrelationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req.headers["x-correlation-id"] as string) || uuidv4();
    asynclocalstorage.run({ correlationId }, () => {
        res.setHeader("x-correlation-id", correlationId);
        next();
    });
};

export const attachCorrelationId = attachCorrelationIdMiddleware;
export default attachCorrelationIdMiddleware;
