import Docker from "dockerode";
import { CPP_IMAGE, PYTHON_IMAGE } from "../constants";
import logger from "../../config/logger.config";

export async function pullImage(image: string): Promise<any> {
    const docker = new Docker();

    return new Promise((resolve, reject) => {
        docker.pull(image, (err: Error | null, stream: NodeJS.ReadableStream) => {
            if (err) {
                reject(err);
                return;
            }

            docker.modem.followProgress(
                stream,
                function onFinished(finalErr, output) {
                    if (finalErr) return reject(finalErr);
                    resolve(output);
                },
                function onProgress(event) {
                    if (event && event.status) {
                        logger.info(`Pulling [${image}]: ${event.status} ${event.progress || ""}`);
                    }
                }
            );
        });
    });
}

export async function pullAllImages(): Promise<void> {
    const images = [PYTHON_IMAGE, CPP_IMAGE];

    // Concurrently pull both runtime images
    const promises = images.map(image => pullImage(image));

    try {
        await Promise.all(promises);
        logger.info("All Docker execution images pulled successfully");
    } catch (error) {
        logger.error("Error pulling Docker images (Docker daemon may be offline):", error);
    }
}
