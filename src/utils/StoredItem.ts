import * as aws from "aws-sdk";

const kms = new aws.KMS({
    apiVersion: "2014-11-01",
    region: process.env["AWS_REGION"] ?? "us-west-2"
});

export interface StoredItem {
    encrypted?: boolean;

    needsEncryption?: boolean; // for this script only

    /**
     * This is a legacy name.  We would call this `accountId` these days.
     * It's not exposed publicly and not worth the migration.
     */
    giftbitUserId: string;
    key: string;
    value: any;
}


export async function encryptStoredItem(storedItem: StoredItem, kmsKeyId: string): Promise<StoredItem> {
    if (storedItem.encrypted) {
        throw new Error("StoredItem is already encrypted.");
    }
    if (!storedItem.needsEncryption) {
        throw new Error("StoredItem does not need encryption.");
    }

    const encryptRes = await kms.encrypt({
        KeyId: kmsKeyId,
        Plaintext: JSON.stringify(storedItem.value)
    }).promise();

    if (encryptRes.CiphertextBlob instanceof Buffer) {
        return {
            ...storedItem,
            needsEncryption: undefined,
            encrypted: true,
            value: encryptRes.CiphertextBlob.toString("base64")
        };
    }
    throw new Error("Unhandled CiphertextBlob type.");
}

export async function decryptStoredItem(storedItem: StoredItem, kmsKeyId: string): Promise<StoredItem> {
    if (!storedItem.encrypted) {
        throw new Error("StoredItem is not encrypted.");
    }

    const decryptRes = await kms.decrypt({
        CiphertextBlob: Buffer.from(storedItem.value as string, "base64")
    }).promise();

    return {
        ...storedItem,
        needsEncryption: true,
        encrypted: undefined,
        value: JSON.parse(decryptRes.Plaintext as string)
    };
}
