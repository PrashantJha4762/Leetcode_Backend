import axios from "axios";
import { serverConfig } from "../config";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export async function updateSubmission(submissionId: string, status: string, output: Record<string, string>) {
    try {
        const baseUrl = serverConfig.SUBMISSION_SERVICE.replace(/\/$/, "");
        const url = `${baseUrl}/submissions/${submissionId}/status`;

        logger.info("Calling SubmissionService to update submission status", { url, submissionId, status });

        const response = await axios.patch(url, {
            status,
            submissionData: output
        });

        if (response.status !== 200 && response.status !== 204) {
            throw new InternalServerError("Failed to update submission status");
        }

        logger.info("Submission status updated successfully in SubmissionService", {
            submissionId,
            data: response.data
        });
        return response.data;
    } catch (error) {
        logger.error(`Failed to update submission ${submissionId}:`, error);
        return null;
    }
}
