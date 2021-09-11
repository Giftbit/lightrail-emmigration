import fs = require("fs");
import mkdirp = require("mkdirp");
import path = require("path");

export async function writeImport(userId: string, filename: string, obj: any): Promise<void> {
    const filepath = `./data/${userId}/${filename}.json`
    console.log("Writing", filepath)
    await mkdirp(path.dirname(filepath));
    await fs.promises.writeFile(filepath, JSON.stringify(obj, null, 2));
}
