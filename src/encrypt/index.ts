import {askPassword, askQuestion} from "../utils/commandLineInput";
import {encryptStoredItem, StoredItem} from "../utils/StoredItem";
import {computeCodeLookupHash, encryptCode} from "../utils/rothschildCrypto";
import {listFiles, readFile, writeFile} from "../utils/fileUtils";

export async function encrypt(accountId: string): Promise<void> {
    const kvsKmsKeyId = await askQuestion("KVS KMS encryption key ID:");
    const rothschildEncryptionSecret = await askPassword("Rothschild encryption secret:")
    const rothschildLookupHashSecret = await askPassword("Rothschild lookup hash secret:")

    await encryptKvs(accountId, kvsKmsKeyId);
    await encryptRothschild(accountId, rothschildEncryptionSecret, rothschildLookupHashSecret);
}

async function encryptKvs(accountId: string, kmsKeyId: string): Promise<void> {
    console.log("Encrypting KVS");

    const storedItems: StoredItem[] = await readFile(accountId, "decrypt", "kvs");
    for (let i = 0; i < storedItems.length; i++) {
        if (storedItems[i].encrypted) {
            storedItems[i] = await encryptStoredItem(storedItems[i], kmsKeyId);
        }
    }
    await writeFile(accountId, "encrypt", "kvs", storedItems);
}

async function encryptRothschild(accountId: string, encryptionSecret: string, lookupHashSecret: string): Promise<void> {
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
