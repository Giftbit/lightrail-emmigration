import {askPassword, askQuestion} from "../utils/commandLineInput";
import {decryptRothschild} from "./decryptRothschild";
import {decryptKvs} from "./decryptKvs";

export async function decrypt(accountId: string): Promise<void> {
    const kvsKmsKeyId = await askQuestion("KVS KMS encryption key ID:", [], /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    const rothschildEncryptionSecret = await askPassword("Rothschild encryption secret:", /^[0-9a-f]{64}$/)

    await decryptKvs(accountId, kvsKmsKeyId);
    await decryptRothschild(accountId, rothschildEncryptionSecret);
}

