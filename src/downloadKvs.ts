import * as dynameh from "dynameh";
import {writeImport} from "./utils/fileUtils";
import {dynamodb} from "./utils/dynamodb";
import {findDynamoTableName} from "./utils/findDynamoTable";

export async function downloadKvs(userId: string): Promise<void> {
    const tableSchema: dynameh.TableSchema = {
        tableName: await findDynamoTableName(/Kvs-Table/),
        partitionKeyField: "giftbitUserId",
        partitionKeyType: "string",
        sortKeyField: "key",
        sortKeyType: "string"
    };

    const queryRequest = dynameh.requestBuilder.buildQueryInput(tableSchema, userId);
    console.log(queryRequest);
    const result = await dynameh.queryHelper.queryAll(dynamodb, queryRequest);
    await writeImport(userId, "kvs", result);
}
