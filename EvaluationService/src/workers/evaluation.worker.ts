import { Job, Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";
import type { EvaluationJob, EvaluationResult, TestCase } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunner.util";
import { LANGUAGE_CONFIG } from "../config/language.config";
import { updateSubmission } from "../api/submission.api";

export function matchTestCasesWithResults(testCases: TestCase[], results: EvaluationResult[]) {
    const output: Record<string, string> = {};

    if (results.length !== testCases.length) {
        logger.warn("Mismatch between test cases count and execution results count", {
            testCasesCount: testCases.length,
            resultsCount: results.length
        });
        return output;
    }

    testCases.forEach((testCase, index) => {
        let retval = "";
        const result = results[index];

        if (!result) {
            retval = "Error";
        } else if (result.status === "time_limit_exceeded") {
            retval = "TLE";
        } else if (result.status === "failed") {
            retval = "Error";
        } else {
            // Trim whitespace and normalise line breaks to accurately compare expected vs actual output
            const actualOutput = (result.output || "").trim().replace(/\r\n/g, "\n");
            const expectedOutput = (testCase.output || "").trim().replace(/\r\n/g, "\n");

            if (actualOutput === expectedOutput) {
                retval = "AC";
            } else {
                retval = "WA";
            }
        }

        const testCaseKey = testCase._id || testCase.id || String(index);
        logger.info(`Test case [${testCaseKey}] evaluation result: ${retval}`);
        output[testCaseKey] = retval;
    });

    return output;
}

export async function setupEvaluationWorker() {
    const worker = new Worker(
        SUBMISSION_QUEUE,
        async (job: Job) => {
            logger.info(`Processing evaluation job: ${job.id}`);
            const data: EvaluationJob = job.data;

            logger.info("Evaluation job data payload:", {
                submissionId: data.submissionId,
                language: data.language,
                testCasesCount: data.problem?.testcases?.length
            });

            try {
                if (!data.problem || !data.problem.testcases || data.problem.testcases.length === 0) {
                    logger.warn("No test cases found for problem evaluation", {
                        submissionId: data.submissionId
                    });
                    await updateSubmission(data.submissionId, "completed", {});
                    return;
                }

                const langConfig = LANGUAGE_CONFIG[data.language];
                if (!langConfig) {
                    logger.error(`Unsupported language requested: ${data.language}`);
                    return;
                }

                // Execute all test cases inside isolated Docker sandboxes concurrently
                const testCasesRunnerPromise = data.problem.testcases.map((testcase) => {
                    return runCode({
                        code: data.code,
                        language: data.language,
                        timeout: langConfig.timeout,
                        imageName: langConfig.imageName,
                        input: testcase.input
                    });
                });

                const testCasesRunnerResults: EvaluationResult[] = await Promise.all(testCasesRunnerPromise);

                logger.info("Raw test case runner results:", { testCasesRunnerResults });

                const output = matchTestCasesWithResults(data.problem.testcases, testCasesRunnerResults);

                logger.info("Final evaluated verdicts:", { output });

                // Report evaluation results back to SubmissionService
                await updateSubmission(data.submissionId, "completed", output || {});
            } catch (error) {
                logger.error(`Evaluation job execution failed for submission ${data.submissionId}:`, error);
                return;
            }
        },
        {
            connection: createNewRedisConnection()
        }
    );

    worker.on("error", (error) => {
        logger.error(`Evaluation worker error: ${error}`);
    });

    worker.on("completed", (job) => {
        logger.info(`Evaluation job completed: ${job.id}`);
    });

    worker.on("failed", (job, error) => {
        logger.error(`Evaluation job failed: ${job?.id}`, error);
    });

    return worker;
}

export async function startworkers() {
    await setupEvaluationWorker();
}
