import knex = require("knex");
import {connectToSqlDatabase} from "../utils/sqlDatabase";
import {FileType, listFiles, readFile} from "../utils/fileUtils";

export async function uploadRothschild(accountId: string): Promise<void> {
    console.log("Downloading Rothschild");

    const knex = await connectToSqlDatabase();
    await knex.raw("SET FOREIGN_KEY_CHECKS=0");

    await uploadTable(accountId, knex, "download", "Currencies");
    await uploadTable(accountId, knex, "download", "Programs");
    await uploadTable(accountId, knex, "download", "Issuances");
    await uploadTable(accountId, knex, "download", "Contacts");
    await uploadTable(accountId, knex, "encrypt", "Values");
    await uploadTable(accountId, knex, "download", "InternalTransactionSteps");
    await uploadTable(accountId, knex, "download", "LightrailTransactionSteps");
    await uploadTable(accountId, knex, "download", "StripeTransactionSteps");
    await uploadTable(accountId, knex, "download", "Transactions");
    await uploadTable(accountId, knex, "download", "TransactionChainBlockers");

    await knex.raw("SET FOREIGN_KEY_CHECKS=1");
    await knex.destroy();
}

async function uploadTable(accountId: string, knex: knex.Knex, fileType: FileType,tableName: string): Promise<void> {
    const filenames = await listFiles(accountId, fileType, `rothschild-${tableName}`);
    for (const filename of filenames) {
        const contents: any[] = await readFile(accountId, fileType, filename);
        await knex(tableName)
            .insert(contents);
    }
}