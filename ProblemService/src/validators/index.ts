import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.config";

type RequestSchema = { parseAsync(data: unknown): Promise<unknown> };

export const validateRequestBody=(schema:RequestSchema)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            logger.info("Validating request body",);
            await schema.parseAsync(req.body)
            logger.info("Request is valid");
            next();
        }
        catch(err){
             res.status(400).json({
                message:"Invalid Request Body",
                success:false,
                error:err
            })
        }
    }
}

export const validateRequestQuery=(schema:RequestSchema)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            logger.info("Validating request query");
            await schema.parseAsync(req.query)
            logger.info("Query is valid");
            next();
        }
        catch(err){
             res.status(400).json({
                message:"Invalid Request Query",
                success:false,
                error:err
            })
        }
    }
}

export const validateRequestParams=(schema:RequestSchema)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            logger.info("Validating request params");
            await schema.parseAsync(req.params);
            logger.info("Request params are valid");
            next();
        }
        catch(err){
            res.status(400).json({
                message:"Invalid Request Params",
                success:false,
                error:err
            });
        }
    }
}
