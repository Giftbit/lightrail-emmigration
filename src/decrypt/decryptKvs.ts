import {decryptStoredItem, StoredItem} from "../utils/StoredItem";
import {readFile, writeFile} from "../utils/fileUtils";

export async function decryptKvs(accountId: string, kmsKeyId: string): Promise<void> {
    console.log("Decrypting KVS");

    const storedItems: StoredItem[] = await readFile(accountId, "download", "kvs");
    for (let i = 0; i < storedItems.length; i++) {
        if (storedItems[i].encrypted) {
            storedItems[i] = await decryptStoredItem(storedItems[i], kmsKeyId);
        }
    }
    await writeFile(accountId, "decrypt", "kvs", storedItems);
}
