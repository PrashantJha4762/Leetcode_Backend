import mongoose from "mongoose"
import { serverconfig } from "."
import { logger } from "./logger.config"

export const ConnectoDb=async()=>{
    try {
        await mongoose.connect(serverconfig.DB_URL)
        logger.info("Successfully connected to mongodb")

        mongoose.connection.on("error",()=>{
            logger.error("Something went wrong")
        })

        mongoose.connection.on("disconnected",()=>{
            logger.info("Disconnected from mongodb")
        })

        process.on("SIGINT",async ()=>{
            await mongoose.connection.close()
            logger.info("Mongodb closed")
            process.exit(0);
        })

    } catch (error) {
        logger.error("Some error occured", error)
        process.exit(1);
    }
}