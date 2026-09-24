import mongoose from "mongoose";
import { serverconfig } from ".";
import { logger } from "./logger.config";

export const connectToDB=async ()=>{
    try {
        await mongoose.connect(serverconfig.DB_URL)

        logger.info("Succesfully connected to mongodb");

        mongoose.connection.on("error",(error)=>{
            logger.error("Some error occured");
        })

        mongoose.connection.on("disconnected",()=>{
            logger.error("disconnected from mongodb")
        })
        
        //SIGNINT is a signal sent when we click ctrl+c , this whole thing is done to gracefully
        //close the connection
        process.on("SIGINT",async ()=>{
            await mongoose.connection.close()
            logger.info("Mongodb connection closed");
            process.exit(0);
        })
        
    } catch (error) {
        logger.error("Problem while connecting to the mongodb")
        process.exit(0);//any non zero digit in this means exit with failure
    }
}