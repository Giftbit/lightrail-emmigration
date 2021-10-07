import {listFiles, readFile, writeFile} from "../utils/fileUtils";
import {computeCodeLookupHash, encryptCode} from "../utils/rothschildCrypto";

export async function encryptRothschild(accountId: string, encryptionSecret: string, lookupHashSecret: string): Promise<void> {
    console.log("Encrypting Rothschild");

    const filenames = await listFiles(accountId, "decrypt", "rothschild-Values");
    for (const filename of filenames) {
        await encryptRothschildFile(accountId, encryptionSecret, lookupHashSecret, filename);
    }
}

export async function encryptRothschildFile(accountId: string, encryptionSecret: string, lookupHashSecret: string, filename: string): Promise<void> {
    if (!encryptionSecret) {
        throw new Error("encryptionSecret is nullish");
    }
    if (!lookupHashSecret) {
        throw new Error("lookupHashSecret is nullish");
    }
    const values: any[] = await readFile(accountId, "decrypt", filename);
    for (const value of values) {
        if (!value?.userId?.startsWith("user-")) {
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
