import {dynamodb} from "./dynamodb";

export async function findDynamoTableName(tableNameRegex: RegExp): Promise<string> {
    const res = await dynamodb.listTables().promise();
    if (!res.TableNames) {
        throw new Error("Account has no DynamoDB tables.")
    }

    for (const tableName of res.TableNames) {
        if (tableNameRegex.test(tableName)) {
            console.log("Found DynamoDB table", tableName);
            return tableName;
        }
    }

    throw new Error(`Could not find DynamoDB table matching ${tableNameRegex}.`)
}
