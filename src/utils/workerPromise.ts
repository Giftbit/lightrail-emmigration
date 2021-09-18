import workerThreads = require("worker_threads");

export function workerPromise(worker: workerThreads.Worker): Promise<void> {
    return new Promise((resolve, reject) => {
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}
