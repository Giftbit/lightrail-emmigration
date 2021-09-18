import workerThreads = require("worker_threads");
import {decryptRothschildFile} from "./decryptRothschild";

const {accountId, encryptionSecret, filename} = workerThreads.workerData;

decryptRothschildFile(accountId, encryptionSecret, filename)
    .then(() => {
        workerThreads.parentPort?.postMessage({});
    }, error => {
        workerThreads.parentPort?.emit("error", error);
    });
