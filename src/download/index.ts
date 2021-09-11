import {downloadKvs} from "./downloadKvs";
import {downloadEdhi} from "./downloadEdhi";
import {downloadRothschild} from "./downloadRothschild";

export async function download(accountId: string): Promise<void> {
    await downloadKvs(accountId);
    await downloadEdhi(accountId);
    await downloadRothschild(accountId);

    console.log("Done")
}
