import {download} from "./download";
import {decrypt} from "./decrypt";
import {encrypt} from "./encrypt";
import {upload} from "./upload";

main();

async function main(): Promise<void> {
    const command = process.argv[2];
    const userId = process.argv[3];

    switch (command) {
        case "download":
            await download(stripTest(userId));
            break;
        case "decrypt":
            await decrypt(stripTest(userId));
            break;
        case "encrypt":
            await encrypt(stripTest(userId));
            break;
        case "upload":
            await upload(stripTest(userId));
            break;
        default:
            throw new Error(`Unknown command '${command}'`);
    }
}

function stripTest(userId: string): string {
    if (userId.endsWith("-TEST")) {
        return userId.substr(0, userId.length - "-TEST".length);
    }
    return userId;
}

