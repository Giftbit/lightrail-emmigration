import * as dynameh from "dynameh";
import {writeDownload} from "../utils/fileUtils";
import {dynamodb} from "../utils/dynamodb";
import {findDynamoTableName} from "../utils/findDynamoTable";

export async function downloadKvs(accountId: string): Promise<void> {
    console.log("Downloading KVS");

    const tableSchema: dynameh.TableSchema = {
        tableName: await findDynamoTableName(/Kvs-Table/),
        partitionKeyField: "giftbitUserId",
        partitionKeyType: "string",
        sortKeyField: "key",
        sortKeyType: "string"
    };

    const req = dynameh.requestBuilder.buildQueryInput(tableSchema, accountId);
    const res = await dynameh.queryHelper.queryAll(dynamodb, req);

    const testReq = dynameh.requestBuilder.buildQueryInput(tableSchema, accountId + "-TEST");
    const testRes = await dynameh.queryHelper.queryAll(dynamodb, testReq);

    await writeDownload(accountId, "kvs", [...res, ...testRes]);
}
