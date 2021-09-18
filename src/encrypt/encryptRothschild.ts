import {listFiles, readFile, writeFile} from "../utils/fileUtils";
import {computeCodeLookupHash, encryptCode} from "../utils/rothschildCrypto";

export async function encryptRothschild(accountId: string, encryptionSecret: string, lookupHashSecret: string): Promise<void> {
    console.log("Encrypting Rothschild");

    const filenames = await listFiles(accountId, "decrypt", "rothschild-Values");
    for (const filename of filenames) {
        const values: any[] = await readFile(accountId, "download", filename);
        for (const value of values) {
            if (value.codeDecrypted) {
                value.encrypted = encryptCode(value.codeDecrypted, encryptionSecret);
                value.codeHashed = computeCodeLookupHash(value.codeDecrypted, accountId, lookupHashSecret);
                delete value.codeDecrypted;
            }
        }
        await writeFile(accountId, "encrypt", filename, values);
    }
}
