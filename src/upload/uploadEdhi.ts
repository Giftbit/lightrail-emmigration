import * as dynameh from "dynameh";
import {readFile} from "../utils/fileUtils";
import {dynamodb} from "../utils/dynamodb";
import {findDynamoTableName} from "../utils/findDynamoTable";

export async function uploadEdhi(accountId: string): Promise<void> {
    console.log("Uploading Edhi");

    const tableName = await findDynamoTableName(/-Edhi-ObjectTable-/);
    const tableSchema: dynameh.TableSchema = {
        tableName: tableName,
        partitionKeyField: "pk",
        partitionKeyType: "string",
        sortKeyField: "sk",
        sortKeyType: "string"
    };

    const items = await readFile(accountId, "download", "edhi");

    const req = dynameh.requestBuilder.buildBatchPutInput(tableSchema, items);
    await dynameh.batchHelper.batchWriteAll(dynamodb, req);
}
