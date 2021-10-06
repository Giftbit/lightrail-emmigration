import workerThreads = require("worker_threads");
import {listFiles, readFile, writeFile} from "../utils/fileUtils";
import {computeCodeLookupHash, encryptCode} from "../utils/rothschildCrypto";
import {groupArray} from "../utils/groupArray";
import {workerPromise} from "../utils/workerPromise";

const threadCount = 4;

export async function encryptRothschild(accountId: string, encryptionSecret: string, lookupHashSecret: string): Promise<void> {
    console.log("Encrypting Rothschild");

    const filenames = await listFiles(accountId, "decrypt", "rothschild-Values");
    if (threadCount < 2) {
        await encryptRothschildFilesSerial(accountId, encryptionSecret, lookupHashSecret, filenames);
    } else {
        await encryptRoschildFilesParallel(accountId, encryptionSecret, lookupHashSecret, filenames);
    }
}

async function encryptRothschildFilesSerial(accountId: string, encryptionSecret: string, lookupHashSecret: string, filenames: string[]): Promise<void> {
    for (const filename of filenames) {
        await encryptRothschildFile(accountId, encryptionSecret, lookupHashSecret, filename);
    }
}

async function encryptRoschildFilesParallel(accountId: string, encryptionSecret: string, lookupHashSecret: string, filenames: string[]): Promise<void> {
    for (const filenameGroup of groupArray(filenames, threadCount)) {
        await Promise.all(filenameGroup
            .map(filename =>
                new workerThreads.Worker(
                    __dirname + "/encryptRothschildWorker.js",
                    {
                        workerData: {accountId,encryptionSecret, filename}
                    }
                )
            )
            .map(workerPromise)
        );
    }
}

export async function encryptRothschildFile(accountId: string, encryptionSecret: string, lookupHashSecret: string, filename: string): Promise<void> {
    const values: any[] = await readFile(accountId, "decrypt", filename);
    for (const value of values) {
        if (!value.userId.startsWith("user-")) {
            throw new Error(`Value ${value.id} does not have a proper userId.`);
        }
        if (value.codeDecrypted) {
            value.codeEncrypted = encryptCode(value.codeDecrypted, encryptionSecret);
            value.codeHashed = computeCodeLookupHash(value.codeDecrypted, value.userId, lookupHashSecret);
            delete value.codeDecrypted;
        }
    }
    await writeFile(accountId, "encrypt", filename, values);
}
