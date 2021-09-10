import {downloadKvs} from "./downloadKvs";

export async function download(userId: string): Promise<void> {
    console.log("Downloading kvs...");
    await downloadKvs(userId);

    console.log("Done")
}
