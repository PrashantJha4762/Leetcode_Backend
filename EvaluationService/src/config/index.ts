// This file contains all the basic configuration logic for the app server to work
import dotenv from "dotenv";

dotenv.config();

export type ServerConfig = {
    PORT: number;
    PROBLEM_SERVICE: string;
    SUBMISSION_SERVICE: string;
};

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3005,
    PROBLEM_SERVICE: process.env.PROBLEM_SERVICE || "http://localhost:3004/api/v1",
    SUBMISSION_SERVICE: process.env.SUBMISSION_SERVICE || "http://localhost:3001/api/v1"
};

// Backwards-compatible alias for existing imports
export const serverconfig = serverConfig;

export default serverConfig;