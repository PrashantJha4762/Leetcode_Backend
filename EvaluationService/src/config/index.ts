import dotenv from "dotenv";

dotenv.config();

type ServerConfig = {
  PORT: number,
  SUBMISSION_SERVICE: string,
};

export const serverconfig: ServerConfig = {
  PORT: Number(process.env.PORT) || 3001,
  SUBMISSION_SERVICE: process.env.SUBMISSION_SERVICE || "http://localhost:3005/api/v1",
};