import knex = require("knex");
import {FileType, listFiles, readFile} from "../utils/fileUtils";

export async function uploadRothschild(accountId: string, knex: knex.Knex): Promise<void> {
    console.log("Uploading Rothschild");

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
}

async function uploadTable(accountId: string, knex: knex.Knex, fileType: FileType,tableName: string): Promise<void> {
    console.log("Uploading", tableName);

    const filenames = await listFiles(accountId, fileType, `rothschild-${tableName}`);
    for (const filename of filenames) {
        const contents: any[] = await readFile(accountId, fileType, filename);
        if (contents.length === 0) {
            continue;
        }

        // If this fails with ER_NET_PACKET_TOO_LARGE look into increasing
        // max_allowed_packet.  67108864 (64 megs) should work.

        try {
            await knex(tableName)
                .insert(contents)
                .onConflict()
                .merge();
        } catch (error) {
            if ((error as any).code === "ER_NET_PACKET_TOO_LARGE") {
                throw new Error(`Got ER_NET_PACKET_TOO_LARGE uploading to table ${tableName}. Try increasing the instance and cluster parameter max_allowed_packet.  67108864 (64 megs) should work.`);

            }
        }
    }
}
