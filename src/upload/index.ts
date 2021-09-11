import {uploadKvs} from "./uploadKvs";
import {uploadEdhi} from "./uploadEdhi";

export async function upload(accountId: string): Promise<void> {
    await uploadKvs(accountId);
    await uploadEdhi(accountId);
}
