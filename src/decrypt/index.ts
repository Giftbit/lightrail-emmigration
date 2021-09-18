import {askPassword, askQuestion} from "../utils/commandLineInput";
import {decryptRothschild} from "./decryptRothschild";
import {decryptKvs} from "./decryptKvs";

export async function decrypt(accountId: string): Promise<void> {
    const kvsKmsKeyId = await askQuestion("KVS KMS encryption key ID:");
    const rothschildEncryptionSecret = await askPassword("Rothschild encryption secret:")

    await decryptKvs(accountId, kvsKmsKeyId);
    await decryptRothschild(accountId, rothschildEncryptionSecret);
}

