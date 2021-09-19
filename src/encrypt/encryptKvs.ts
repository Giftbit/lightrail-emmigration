import {encryptStoredItem, StoredItem} from "../utils/StoredItem";
import {readFile, writeFile} from "../utils/fileUtils";

export async function encryptKvs(accountId: string, kmsKeyId: string): Promise<void> {
    console.log("Encrypting KVS");

    const storedItems: StoredItem[] = await readFile(accountId, "decrypt", "kvs");
    for (let i = 0; i < storedItems.length; i++) {
        if (storedItems[i].needsEncryption) {
            storedItems[i] = await encryptStoredItem(storedItems[i], kmsKeyId);
        }
    }
    await writeFile(accountId, "encrypt", "kvs", storedItems);
}
