import * as cryptojs from "crypto-js";

const CODEBASE_ENCRYPTION_PEPPER = "5aa348b6ff321a5b6b7701b7da0cc2dc";

/**
 * The resulting encrypted value does not need to be unique in the database.
 * This is why the userId is not appended to the code value.
 */
export function encryptCode(code: string, encryptionSecret: string): string {
    return cryptojs.AES.encrypt(addCodebasePepperToCode(code), encryptionSecret).toString();
}

export function decryptCode(codeEncrypted: string, encryptionSecret: string): string {
    const bytes = cryptojs.AES.decrypt(codeEncrypted.toString(), encryptionSecret);
    const decryptedCodeWithCodebasePepper = bytes.toString(cryptojs.enc.Utf8);
    return removeCodebasePepperFromDecryptedCode(decryptedCodeWithCodebasePepper);
}

export function computeCodeLookupHash(code: string, accountId: string, lookupHashSecret: string): string {
    return cryptojs.SHA512(code + accountId + lookupHashSecret).toString();
}

/**
 * IMPORTANT: This is used so that if the AWS account is compromised
 * the codes can't be decrypted without access to the codebase.
 */
export function addCodebasePepperToCode(code: string): string {
    return code + CODEBASE_ENCRYPTION_PEPPER;
}

export function removeCodebasePepperFromDecryptedCode(decryptedCode: string): string {
    return decryptedCode.replace(CODEBASE_ENCRYPTION_PEPPER, "");
}
