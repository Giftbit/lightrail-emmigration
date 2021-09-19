import {downloadKvs} from "./downloadKvs";
import {downloadEdhi} from "./downloadEdhi";
import {downloadRothschild} from "./downloadRothschild";
import {connectToSqlDatabase} from "../utils/sqlDatabase";

export async function download(accountId: string): Promise<void> {
    const knex = await connectToSqlDatabase();

    await downloadKvs(accountId);
    await downloadEdhi(accountId);
    await downloadRothschild(accountId, knex);

    await knex.destroy();
}
