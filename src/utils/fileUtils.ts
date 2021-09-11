import fs = require("fs");
import mkdirp = require("mkdirp");
import path = require("path");

export async function writeDownload(accountId: string, filename: string, obj: any): Promise<void> {
    const filepath = `./data/download/${accountId}/${filename}.json`;
    console.log("Writing", filepath);
    await mkdirp(path.dirname(filepath));
    await fs.promises.writeFile(filepath, JSON.stringify(obj, null, 2));
}

export async function readDownload(accountId: string, filename: string): Promise<any> {
    const filepath = `./data/download/${accountId}/${filename}.json`;
    console.log("Reading", filepath);
    const fileContents = await fs.promises.readFile(filepath);
    return JSON.parse(fileContents.toString("utf-8"));
}

export async function listDownloads(accountId: string, prefix: string): Promise<any> {
    const filepath = `./data/download/${accountId}/`;
    const files = await fs.promises.readdir(filepath);
    return files
        .filter(file => file.startsWith(prefix))
        .map(file => path.basename(file, ".json"));
}

export async function writeDecrypt(accountId: string, filename: string, obj: any): Promise<void> {
    const filepath = `./data/decrypt/${accountId}/${filename}.json`;
    console.log("Writing", filepath);
    await mkdirp(path.dirname(filepath));
    await fs.promises.writeFile(filepath, JSON.stringify(obj, null, 2));
}

export async function readDecrypt(accountId: string, filename: string): Promise<any> {
    const filepath = `./data/decrypt/${accountId}/${filename}.json`;
    console.log("Reading", filepath);
    const fileContents = await fs.promises.readFile(filepath);
    return JSON.parse(fileContents.toString("utf-8"));
}

export async function listDecrypts(accountId: string, prefix: string): Promise<any> {
    const filepath = `./data/decrypt/${accountId}/`;
    const files = await fs.promises.readdir(filepath);
    return files
        .filter(file => file.startsWith(prefix))
        .map(file => path.basename(file, ".json"));
}

export async function writeEncrypt(accountId: string, filename: string, obj: any): Promise<void> {
    const filepath = `./data/encrypt/${accountId}/${filename}.json`;
    console.log("Writing", filepath);
    await mkdirp(path.dirname(filepath));
    await fs.promises.writeFile(filepath, JSON.stringify(obj, null, 2));
}

export async function readEncrypt(accountId: string, filename: string): Promise<any> {
    const filepath = `./data/encrypt/${accountId}/${filename}.json`;
    console.log("Reading", filepath);
    const fileContents = await fs.promises.readFile(filepath);
    return JSON.parse(fileContents.toString("utf-8"));
}
