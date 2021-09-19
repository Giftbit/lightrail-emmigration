import {uploadKvs} from "./uploadKvs";
import {uploadEdhi} from "./uploadEdhi";
import {uploadRothschild} from "./uploadRothschild";
import {connectToSqlDatabase} from "../utils/sqlDatabase";

export async function upload(accountId: string): Promise<void> {
    const knex = await connectToSqlDatabase();

    await uploadKvs(accountId);
    await uploadEdhi(accountId);
    await uploadRothschild(accountId, knex);

    await knex.destroy();
}
