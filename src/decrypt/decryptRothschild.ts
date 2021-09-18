import {listFiles, readFile, writeFile} from "../utils/fileUtils";
import {decryptCode} from "../utils/rothschildCrypto";

export async function decryptRothschild(accountId: string, encryptionSecret: string): Promise<void> {
    console.log("Decrypting Rothschild");

    const filenames = await listFiles(accountId, "download", "rothschild-Values");
    for (const filename of filenames) {
        const values: any[] = await readFile(accountId, "download", filename);
        for (const value of values) {
            if (value.codeEncrypted) {
                value.codeDecrypted = decryptCode(value.codeEncrypted, encryptionSecret);
            }
        }
        await writeFile(accountId, "decrypt", filename, values);
    }
}
