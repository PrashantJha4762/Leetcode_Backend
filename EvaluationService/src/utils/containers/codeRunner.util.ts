import { InternalServerError } from "../errors/app.error";
import { commands } from "./commands.util";
import { createNewDockerContainer } from "./createContainer.util";
import logger from "../../config/logger.config";

const allowListedLanguage = ["python", "cpp"] as const;
export type SupportedLanguage = typeof allowListedLanguage[number];

export interface RunCodeOptions {
    code: string;
    language: "python" | "cpp";
    timeout: number;
    imageName: string;
    input: string;
}

export async function runCode(options: RunCodeOptions) {
    const { code, language, timeout, imageName, input } = options;

    if (!allowListedLanguage.includes(language)) {
        throw new InternalServerError(`Invalid language: ${language}`);
    }

    const container = await createNewDockerContainer({
        imageName: imageName,
        cmdExecutable: commands[language](code, input),
        memoryLimit: 1024 * 1024 * 1024, // 1GB limit
    });

    if (!container) {
        logger.error("Failed to create Docker container for code execution");
        return {
            status: "failed" as const,
            output: "Container creation failed. Please check Docker daemon status."
        };
    }

    let isTimeLimitExceeded = false;
    let timeLimitExceededTimeout: NodeJS.Timeout | null = null;

    try {
        timeLimitExceededTimeout = setTimeout(() => {
            logger.warn(`Time limit exceeded (${timeout}ms). Terminating container ${container.id}...`);
            isTimeLimitExceeded = true;
            container.kill().catch((err: any) => {
                logger.error(`Error killing container ${container.id}:`, err);
            });
        }, timeout);

        await container.start();

        const status = await container.wait();

        if (timeLimitExceededTimeout) {
            clearTimeout(timeLimitExceededTimeout);
        }

        if (isTimeLimitExceeded) {
            await container.remove({ force: true }).catch(() => {});
            return {
                status: "time_limit_exceeded" as const,
                output: "Time limit exceeded"
            };
        }

        const logs = await container.logs({
            stdout: true,
            stderr: true
        });

        const containerLogs = processLogs(logs);

        await container.remove({ force: true }).catch(() => {});

        if (status && status.StatusCode === 0) {
            return {
                status: "success" as const,
                output: containerLogs
            };
        } else {
            return {
                status: "failed" as const,
                output: containerLogs
            };
        }
    } catch (error) {
        if (timeLimitExceededTimeout) {
            clearTimeout(timeLimitExceededTimeout);
        }
        await container.remove({ force: true }).catch(() => {});
        logger.error("Error executing code inside container:", error);
        return {
            status: "failed" as const,
            output: String(error)
        };
    }
}

function processLogs(logs: Buffer | undefined): string {
    if (!logs) return "";
    return logs
        .toString("utf8")
        .replace(/\x00/g, "") // Remove null bytes
        .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, "") // Strip terminal control characters except \n (0x0A)
        .trim();
}
