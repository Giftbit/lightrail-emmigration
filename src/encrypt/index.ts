import {askPassword, askQuestion} from "../utils/commandLineInput";
import {encryptKvs} from "./encryptKvs";
import {encryptRothschild} from "./encryptRothschild";

export async function encrypt(accountId: string): Promise<void> {
    const kvsKmsKeyId = await askQuestion("KVS KMS encryption key ID:");
    const rothschildEncryptionSecret = await askPassword("Rothschild encryption secret:")
    const rothschildLookupHashSecret = await askPassword("Rothschild lookup hash secret:")

    await encryptKvs(accountId, kvsKmsKeyId);
    await encryptRothschild(accountId, rothschildEncryptionSecret, rothschildLookupHashSecret);
}

