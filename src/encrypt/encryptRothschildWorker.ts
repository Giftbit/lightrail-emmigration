import workerThreads = require("worker_threads");
import {encryptRothschildFile} from "./encryptRothschild";

const {accountId, encryptionSecret, lookupHashSecret, filename} = workerThreads.workerData;

encryptRothschildFile(accountId, encryptionSecret, lookupHashSecret, filename)
    .then(() => {
        workerThreads.parentPort?.postMessage({});
    }, error => {
        workerThreads.parentPort?.emit("error", error);
    });

