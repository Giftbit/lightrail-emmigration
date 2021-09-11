import {askPassword, askQuestion} from "../utils/commandLineInput";
import {decryptStoredItem, encryptStoredItem, StoredItem} from "../utils/StoredItem";
import {listDecrypts, listDownloads, readDecrypt, readDownload, writeDecrypt, writeEncrypt} from "../utils/fileUtils";
import {computeCodeLookupHash, decryptCode, encryptCode} from "../utils/rothschildCrypto";

export async function encrypt(accountId: string): Promise<void> {
    const kvsKmsKeyId = await askQuestion("KVS KMS encryption key ID:");
    const rothschildEncryptionSecret = await askPassword("Rothschild encryption secret:")
    const rothschildLookupHashSecret = await askPassword("Rothschild lookup hash secret:")

    await encryptKvs(accountId, kvsKmsKeyId);
    await encryptRothschild(accountId, rothschildEncryptionSecret, rothschildLookupHashSecret);
}

async function encryptKvs(accountId: string, kmsKeyId: string): Promise<void> {
    console.log("Encrypting KVS");

    const storedItems: StoredItem[] = await readDecrypt(accountId, "kvs");
    for (let i = 0; i < storedItems.length; i++) {
        if (storedItems[i].encrypted) {
            storedItems[i] = await encryptStoredItem(storedItems[i], kmsKeyId);
        }
    }
    await writeEncrypt(accountId, "kvs", storedItems);
}

async function encryptRothschild(accountId: string, encryptionSecret: string, lookupHashSecret: string): Promise<void> {
    console.log("Encrypting Rothschild");

    const filenames = await listDecrypts(accountId, "rothschild-Values");
    for (const filename of filenames) {
        const values: any[] = await readDownload(accountId, filename);
        for (const value of values) {
            if (value.codeDecrypted) {
                value.encrypted = encryptCode(value.codeDecrypted, encryptionSecret);
                value.codeHashed = computeCodeLookupHash(value.codeDecrypted, accountId, lookupHashSecret);
                delete value.codeDecrypted;
            }
        }
        await writeEncrypt(accountId, filename, values);
    }
}
