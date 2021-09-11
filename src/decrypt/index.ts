import {askPassword, askQuestion} from "../utils/commandLineInput";
import {listDownloads, readDownload, writeDecrypt, writeEncrypt} from "../utils/fileUtils";
import {decryptStoredItem, StoredItem} from "../utils/StoredItem";
import {decryptCode} from "../utils/rothschildCrypto";

export async function decrypt(accountId: string): Promise<void> {
    const kvsKmsKeyId = await askQuestion("KVS KMS encryption key ID:");
    const rothschildEncryptionSecret = await askPassword("Rothschild encryption secret:")

    await decryptKvs(accountId, kvsKmsKeyId);
    await decryptRothschild(accountId, rothschildEncryptionSecret);
}

async function decryptKvs(accountId: string, kmsKeyId: string): Promise<void> {
    console.log("Decrypting KVS");

    const storedItems: StoredItem[] = await readDownload(accountId, "kvs");
    for (let i = 0; i < storedItems.length; i++) {
        if (storedItems[i].encrypted) {
            storedItems[i] = await decryptStoredItem(storedItems[i], kmsKeyId);
        }
    }
    await writeDecrypt(accountId, "kvs", storedItems);
}

async function decryptRothschild(accountId: string, encryptionSecret: string): Promise<void> {
    console.log("Decrypting Rothschild");

    const filenames = await listDownloads(accountId, "rothschild-Values");
    for (const filename of filenames) {
        const values: any[] = await readDownload(accountId, filename);
        for (const value of values) {
            if (value.codeEncrypted) {
                value.codeDecrypted = decryptCode(value.codeEncrypted, encryptionSecret);
            }
        }
        await writeDecrypt(accountId, filename, values);
    }
}
