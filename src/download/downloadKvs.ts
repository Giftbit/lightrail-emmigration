import * as dynameh from "dynameh";
import {writeImport} from "../utils/fileUtils";
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

    const queryRequest = dynameh.requestBuilder.buildQueryInput(tableSchema, accountId);
    const result = await dynameh.queryHelper.queryAll(dynamodb, queryRequest);
    await writeImport(accountId, "kvs", result);
}
