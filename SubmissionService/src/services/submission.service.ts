import { getProblemById } from "../apis/submission.api";
import { logger } from "../config/logger.config";
import { SubmissionLanguage, type ISubmission, type SubmissionData, type SubmissionStatus } from "../models/submission.model";
import { AddJobs } from "../producers/submission.producer";
import type { ISubmissionRepository } from "../repositories/submission.repo";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/error/app.error";

export interface ISubmissionService {
    createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission>;
    getSubmissionById(id: string): Promise<ISubmission | null>;
    getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
    deleteSubmissionById(id: string): Promise<boolean>;
    updateSubmissionStatus(id: string, status: SubmissionStatus, submissionData: SubmissionData): Promise<ISubmission | null>;
}

export class SubmissionService implements ISubmissionService {
    private submissionRepository: ISubmissionRepository

    constructor(submissionRepository: ISubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }
    async createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission> {
        if (!submissionData.problemId) {
            throw new BadRequestError("Problem ID is required");
        }
        if (!submissionData.code?.trim()) {
            throw new BadRequestError("Code is required");
        }
        if (!submissionData.language) {
            throw new BadRequestError("Language is required");
        }
        if (!Object.values(SubmissionLanguage).includes(submissionData.language)) {
            throw new BadRequestError("Unsupported submission language");
        }

        logger.info("Getting problem by ID", { problemId: submissionData.problemId });
        const problem = await getProblemById(submissionData.problemId);
        if (!problem) {
            throw new NotFoundError("Problem not found");
        }

        const submission = await this.submissionRepository.create(submissionData);
        const submissionId = submission._id.toString();
        logger.info("Submission created successfully", { submissionId });

        const jobId = await AddJobs({
            submissionId,
            problem,
            code: submission.code,
            language: submission.language,
        });

        if (!jobId) {
            // Roll back the record so it cannot remain pending without an evaluation job.
            try {
                await this.submissionRepository.deleteById(submissionId);
            } catch (error) {
                logger.error("Failed to remove submission after queueing failed", {
                    submissionId,
                    error,
                });
            }
            throw new InternalServerError("Failed to queue submission for evaluation");
        }

        logger.info("Submission queued for evaluation", { submissionId, jobId });
        return submission;
    }
    async getSubmissionById(id: string): Promise<ISubmission | null> {
        return this.submissionRepository.findById(id);
    }
    async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
        return this.submissionRepository.findByProblemId(problemId);
    }
    async deleteSubmissionById(id: string): Promise<boolean> {
        const deleted = await this.submissionRepository.deleteById(id);
        if (!deleted) {
            throw new NotFoundError("Submission not found");
        }
        return true;
    }
    async updateSubmissionStatus(id: string, status: SubmissionStatus, submissionData: SubmissionData): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.updateById(id, status, submissionData);
        if(!submission) {
            throw new NotFoundError("Submission not found");
        }
        return submission;
    }
}    
