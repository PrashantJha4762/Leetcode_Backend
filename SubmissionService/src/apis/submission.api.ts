import axios from "axios";
import type { AxiosResponse } from "axios";
import { serverconfig } from "../config";
import { logger } from "../config/logger.config";
import { InternalServerError } from "../utils/error/app.error";

export interface Itestcase {
  input: string;
  output: string;
}

export interface Iproblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  editorial?: string;
  testcases: Itestcase[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProblemResponse {
  data: Iproblem;
  message: string;
  success: boolean;
}

export async function getProblemById(problemId: string): Promise<Iproblem | null> {
  const url = `${serverconfig.PROBLEM_SERVICE.replace(/\/$/, "")}/problems/${encodeURIComponent(problemId)}`;

  try {
    logger.info("Getting problem by ID", { problemId, url });
    const response: AxiosResponse<IProblemResponse> = await axios.get<IProblemResponse>(url);

    if (!response.data?.success || !response.data.data) {
      logger.warn("Problem service did not return a problem", { problemId, url });
      return null;
    }

    return response.data.data;
  } catch (error) {
    logger.error("Failed to get problem details", { problemId, url, error });
    throw new InternalServerError("Failed to get problem details");
  }
}
