import fs = require("fs");
import mkdirp = require("mkdirp");

export async function writeImport(userId: string, filename: string, obj: any): Promise<void> {
    await mkdirp(`./data/${userId}/`);
    await fs.promises.writeFile(`./data/${userId}/${filename}.json`, JSON.stringify(obj, null, 2));
}
