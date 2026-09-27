import type { Iproblem } from "../apis/submission.api";
import { logger } from "../config/logger.config";
import type { SubmissionLanguage } from "../models/submission.model";
import { submissionqueue } from "../queue/submission.queue";

export interface Isubmissiondata{
    submissionId: string;
    problem: Iproblem;
    code: string;
    language: SubmissionLanguage;
}

export async function AddJobs(submissiondata:Isubmissiondata): Promise<string|null>{
    try {
        const job=await submissionqueue.add("evaluate-sumission",submissiondata)
        logger.info(`Submission job added: ${job.id}`);
        return job.id||null
    } catch (error) {
        logger.info("failed to add the job")
        return null
    }
}