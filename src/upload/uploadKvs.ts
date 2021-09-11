import * as dynameh from "dynameh";
import {readFile} from "../utils/fileUtils";
import {dynamodb} from "../utils/dynamodb";
import {findDynamoTableName} from "../utils/findDynamoTable";

export async function uploadKvs(accountId: string): Promise<void> {
    console.log("Uploading KVS");

    const tableSchema: dynameh.TableSchema = {
        tableName: await findDynamoTableName(/Kvs-Table/),
        partitionKeyField: "giftbitUserId",
        partitionKeyType: "string",
        sortKeyField: "key",
        sortKeyType: "string"
    };

    const items = await readFile(accountId, "encrypt", "kvs");

    const req = dynameh.requestBuilder.buildBatchPutInput(tableSchema, items);
    await dynameh.batchHelper.batchWriteAll(dynamodb, req);
}
