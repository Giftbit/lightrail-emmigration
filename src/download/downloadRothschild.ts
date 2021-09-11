import knex = require("knex");
import {connectToSqlDatabase} from "../utils/sqlDatabase";
import {writeImport} from "../utils/fileUtils";

export async function downloadRothschild(accountId: string): Promise<void> {
    console.log("Downloading Rothschild");

    const knex = await connectToSqlDatabase();
    await naiveSqlDownload(accountId, knex, "Currencies");
    await naiveSqlDownload(accountId, knex, "Programs");
    await naiveSqlDownload(accountId, knex, "Issuances");
    await pagedSqlDownload(accountId, knex, "Contacts");
    await pagedSqlDownload(accountId, knex, "Values");
    await pagedSqlDownload(accountId, knex, "InternalTransactionSteps");
    await pagedSqlDownload(accountId, knex, "LightrailTransactionSteps");
    await pagedSqlDownload(accountId, knex, "StripeTransactionSteps");
    await pagedSqlDownload(accountId, knex, "Transactions");
    await naiveSqlDownload(accountId, knex, "TransactionChainBlockers");

    await knex.destroy();
}

// Contacts
// Currencies
// InternalTransactionSteps
// Issuances
// LightrailTransactionSteps
// Programs
// StripeTransactionSteps
// TransactionChainBlockers
// Transactions
// Values

async function naiveSqlDownload(accountId: string, knex: knex.Knex, tableName: string): Promise<void> {
    console.log("Downloading", tableName);

    const res = await knex(tableName)
        .select()
        .where({userId: accountId});
    await writeImport(accountId, `rothschild-${tableName}`, res);

    const resTest = await knex(tableName)
        .select()
        .where({userId: accountId + "-TEST"});
    await writeImport(accountId, `rothschild-${tableName}-test`, resTest);
}

async function pagedSqlDownload(accountId: string, knex: knex.Knex, tableName: string, idField = "id"): Promise<void> {
    console.log("Downloading", tableName);

    const limit = 20000;

    let res = await knex(tableName)
        .select()
        .where({userId: accountId})
        .limit(limit)
        .orderBy(idField, "ASC");
    await writeImport(accountId, `rothschild-${tableName}-0`, res);
    for (let pageIx = 1; res.length === limit; pageIx++) {
        res = await knex(tableName)
            .select()
            .where({userId: accountId})
            .where(idField, ">", res[limit - 1][idField])
            .limit(limit)
            .orderBy(idField, "ASC");
        await writeImport(accountId, `rothschild-${tableName}-${pageIx}`, res);
    }

    let resTest = await knex(tableName)
        .select()
        .where({userId: accountId + "-TEST"})
        .limit(limit)
        .orderBy(idField, "ASC");
    await writeImport(accountId, `rothschild-${tableName}-test-0`, resTest);
    for (let pageIx = 1; resTest.length === limit; pageIx++) {
        resTest = await knex(tableName)
            .select()
            .where({userId: accountId + "-TEST"})
            .where(idField, ">", resTest[limit - 1][idField])
            .limit(limit)
            .orderBy(idField, "ASC");
        await writeImport(accountId, `rothschild-${tableName}-test-${pageIx}`, resTest);
    }
}
