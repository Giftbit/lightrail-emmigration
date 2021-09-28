import {askPassword, askQuestion} from "../utils/commandLineInput";
import {encryptKvs} from "./encryptKvs";
import {encryptRothschild} from "./encryptRothschild";

export async function encrypt(accountId: string): Promise<void> {
    const kvsKmsKeyId = await askQuestion("KVS KMS encryption key ID:", [], /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const rothschildEncryptionSecret = await askPassword("Rothschild encryption secret:", /^[0-9a-f]{64}$/i)
    const rothschildLookupHashSecret = await askPassword("Rothschild lookup hash secret:", /^[0-9a-f]{64}$/i)

    await encryptKvs(accountId, kvsKmsKeyId);
    await encryptRothschild(accountId, rothschildEncryptionSecret, rothschildLookupHashSecret);
}

