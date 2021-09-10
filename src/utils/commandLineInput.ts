import readline from "readline";

/**
 * Prompt user for console input.
 */
export async function askQuestion(question: string, allowedResults: string[] = []): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    const result = await new Promise(resolve => rl.question(question, (ans: string) => {
        rl.close();
        resolve(ans);
    })) as string;
    if (allowedResults.length > 1 && allowedResults.indexOf(result) === -1) {
        console.log("Invalid input...");
        return await askQuestion(question, allowedResults) as string;
    }
    return result;
}

/**
 * Prompt user for console input.
 */
export async function askPassword(question: string, allowedResults: string[] = []): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const keypressListener = function (): void {
        // get the number of characters entered so far:
        const len = rl.line.length;
        // move cursor back to the beginning of the input:
        readline.moveCursor(process.stdout, -len, 0);
        // clear everything to the right of the cursor:
        readline.clearLine(process.stdout, 1);
        // replace the original input with asterisks:
        for (let i = 0; i < len; i++) {
            process.stdout.write("*");
        }
    };
    process.stdin.on("keypress", keypressListener);

    return await new Promise(resolve => rl.question(question, (ans: string) => {
        process.stdin.off("keypress", keypressListener);
        rl.close();
        resolve(ans);
    })) as string;
}
