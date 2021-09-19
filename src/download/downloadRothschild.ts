import knex = require("knex");
import {writeFile} from "../utils/fileUtils";

export async function downloadRothschild(accountId: string, knex: knex.Knex): Promise<void> {
    console.log("Downloading Rothschild");

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
}

async function naiveSqlDownload(accountId: string, knex: knex.Knex, tableName: string): Promise<void> {
    console.log("Downloading", tableName);

    const res = await knex(tableName)
        .select()
        .where({userId: accountId});
    await writeFile(accountId, "download", `rothschild-${tableName}-live`, res);

    const resTest = await knex(tableName)
        .select()
        .where({userId: accountId + "-TEST"});
    await writeFile(accountId, "download", `rothschild-${tableName}-test`, resTest);
}

async function pagedSqlDownload(accountId: string, knex: knex.Knex, tableName: string, idField = "id"): Promise<void> {
    console.log("Downloading", tableName);

    // Empirically gets a number of records that can be uploaded back in one query.
    const limit = 5000;

    let res = await knex(tableName)
        .select()
        .where({userId: accountId})
        .limit(limit)
        .orderBy(idField, "ASC");
    await writeFile(accountId, "download", `rothschild-${tableName}-live-0`, res);
    for (let pageIx = 1; res.length === limit; pageIx++) {
        res = await knex(tableName)
            .select()
            .where({userId: accountId})
            .where(idField, ">", res[limit - 1][idField])
            .limit(limit)
            .orderBy(idField, "ASC");
        await writeFile(accountId, "download", `rothschild-${tableName}-live-${pageIx}`, res);
    }

    let resTest = await knex(tableName)
        .select()
        .where({userId: accountId + "-TEST"})
        .limit(limit)
        .orderBy(idField, "ASC");
    await writeFile(accountId, "download", `rothschild-${tableName}-test-0`, resTest);
    for (let pageIx = 1; resTest.length === limit; pageIx++) {
        resTest = await knex(tableName)
            .select()
            .where({userId: accountId + "-TEST"})
            .where(idField, ">", resTest[limit - 1][idField])
            .limit(limit)
            .orderBy(idField, "ASC");
        await writeFile(accountId, "download", `rothschild-${tableName}-test-${pageIx}`, resTest);
    }
}
