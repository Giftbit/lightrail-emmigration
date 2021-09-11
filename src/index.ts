import {download} from "./download";
import {decrypt} from "./decrypt";

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

