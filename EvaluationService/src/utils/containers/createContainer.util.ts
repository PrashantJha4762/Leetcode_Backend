import logger from "../../config/logger.config";
import Docker from "dockerode";

export interface CreateContainerOptions {
    imageName: string;
    cmdExecutable: string[];
    memoryLimit: number;
}

export async function createNewDockerContainer(options: CreateContainerOptions) {
    try {
        const docker = new Docker();

        const container = await docker.createContainer({
            Image: options.imageName,
            Cmd: options.cmdExecutable,
            AttachStdin: true, // Allow stdin stream
            AttachStdout: true, // Capture stdout stream
            AttachStderr: true, // Capture stderr stream
            Tty: false,
            OpenStdin: true, // Keep input stream open
            HostConfig: {
                Memory: options.memoryLimit,
                PidsLimit: 100, // Limit maximum processes inside container to prevent fork bombs
                CpuQuota: 50000, // 50% CPU limit
                CpuPeriod: 100000,
                SecurityOpt: ['no-new-privileges'], // Prevent privilege escalation attacks
                NetworkMode: 'none', // Disallow any network access inside the sandbox
            }
        });

        logger.info(`Container created with id ${container.id}`);
        return container;
    } catch (error) {
        logger.error("Error creating new docker container", error);
        return null;
    }
}
