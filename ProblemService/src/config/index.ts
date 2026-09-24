import dotenv from "dotenv";

dotenv.config();

type ServerConfig = {
  PORT: number,
  DB_URL:string
};

export const serverconfig: ServerConfig = {
  PORT: Number(process.env.PORT) || 3001,
  DB_URL:process.env.DB_URL||"mongodb://localhost:27017/LC_PROBLEM_DB"
};