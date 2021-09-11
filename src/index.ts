import yargs = require("yargs/yargs");
import {download} from "./download";

main();

async function main(): Promise<void> {
    const args = await yargs(process.argv.slice(2))
        .options("download", {
            alias: "d",
            boolean: true
        })
        .options("upload", {
            alias: "u",
            boolean: true,
            conflicts: ["download"]
        })
        .options("userId", {
            alias: "i",
            required: true,
            describe: "*account* userId",
            string: true
        })
        .help()
        .argv;

    if (args.download) {
        await download(stripTest(args.userId));
    } else if (args.upload) {
        // await upload(stripeTestargs.userId));
    }
}

function stripTest(userId: string): string {
    if (userId.endsWith("-TEST")) {
        return userId.substr(0, userId.length - "-TEST".length);
    }
    return userId;
}

