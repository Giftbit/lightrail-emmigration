import workerThreads = require("worker_threads");
import {listFiles, readFile, writeFile} from "../utils/fileUtils";
import {decryptCode} from "../utils/rothschildCrypto";
import {groupArray} from "../utils/groupArray";
import {workerPromise} from "../utils/workerPromise";

const threadCount = 4;

export async function decryptRothschild(accountId: string, encryptionSecret: string): Promise<void> {
    console.log("Decrypting Rothschild");

    const filenames = await listFiles(accountId, "download", "rothschild-Values");
    if (threadCount < 2) {
        await decryptRothschildFilesSerial(accountId, encryptionSecret, filenames);
    } else {
        await decryptRothschildFilesParallel(accountId, encryptionSecret, filenames);
    }
}

async function decryptRothschildFilesSerial(accountId: string, encryptionSecret: string, filenames: string[]): Promise<void> {
    for (const filename of filenames) {
        await decryptRothschildFile(accountId, encryptionSecret, filename);
    }
}

async function decryptRothschildFilesParallel(accountId: string, encryptionSecret: string, filenames: string[]): Promise<void> {
    for (const filenameGroup of groupArray(filenames, threadCount)) {
        await Promise.all(filenameGroup
            .map(filename =>
                new workerThreads.Worker(
                    __dirname + "/decryptRothschildWorker.js",
                    {
                        workerData: {accountId,encryptionSecret, filename}
                    }
                )
            )
            .map(workerPromise)
        );
    }
}

export async function decryptRothschildFile(accountId: string, encryptionSecret: string, filename: string): Promise<void> {
    const values: any[] = await readFile(accountId, "download", filename);
    for (const value of values) {
        if (value.codeEncrypted) {
            value.codeDecrypted = decryptCode(value.codeEncrypted, encryptionSecret);
        }
    }
    await writeFile(accountId, "decrypt", filename, values);
}
