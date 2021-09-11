import fs = require("fs");
import mkdirp = require("mkdirp");
import path = require("path");

export type FileType = "download" | "decrypt" | "encrypt";

export async function writeFile(accountId: string, fileType: FileType, filename: string, obj: any): Promise<void> {
    const filepath = `./data/${accountId}/${fileType}/${filename}.json`;
    console.log("Writing", filepath);
    await mkdirp(path.dirname(filepath));
    await fs.promises.writeFile(filepath, JSON.stringify(obj, null, 2));
}

export async function readFile(accountId: string, fileType: FileType, filename: string): Promise<any> {
    const filepath = `./data/${accountId}/${fileType}/${filename}.json`;
    console.log("Reading", filepath);
    const fileContents = await fs.promises.readFile(filepath);
    return JSON.parse(fileContents.toString("utf-8"));
}

export async function listFiles(accountId: string, fileType: FileType, prefix: string): Promise<any> {
    const filepath = `./data/${accountId}/${fileType}/`;
    const files = await fs.promises.readdir(filepath);
    return files
        .filter(file => file.startsWith(prefix))
        .map(file => path.basename(file, ".json"));
}
