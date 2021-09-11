import {downloadKvs} from "./downloadKvs";
import {downloadEdhi} from "./downloadEdhi";

export async function download(accountId: string): Promise<void> {
    console.log("Downloading KVS");
    await downloadKvs(accountId);

    console.log("Downloading Edhi");
    await downloadEdhi(accountId);

    console.log("Done")
}
