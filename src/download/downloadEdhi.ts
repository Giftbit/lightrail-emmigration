import * as dynameh from "dynameh";
import {writeDownload} from "../utils/fileUtils";
import {dynamodb} from "../utils/dynamodb";
import {findDynamoTableName} from "../utils/findDynamoTable";

interface AccountObject {
    pk: string;
    sk: string;
    userId: string;
}

export async function downloadEdhi(accountId: string): Promise<void> {
    console.log("Downloading Edhi");

    const tableName = await findDynamoTableName(/-Edhi-ObjectTable-/);
    const tableSchema: dynameh.TableSchema = {
        tableName: tableName,
        partitionKeyField: "pk",
        partitionKeyType: "string",
        sortKeyField: "sk",
        sortKeyType: "string"
    };
    const tableSchema2: dynameh.TableSchema = {
        tableName: tableName,
        indexName: "EdhiIx2",
        indexProperties: {
            projectionType: "ALL",
            type: "GLOBAL"
        },
        partitionKeyField: "pk2",
        partitionKeyType: "string",
        sortKeyField: "sk2",
        sortKeyType: "string",
        ttlField: "ttl"
    };

    const accountQueryReq = dynameh.requestBuilder.buildQueryInput(tableSchema, `Account/${accountId}`);
    const accountRes: AccountObject[] = await dynameh.queryHelper.queryAll(dynamodb, accountQueryReq);

    const userRes = (await Promise.all(getAccountUserIds(accountRes)
        .map(userId => {
            const userQueryReq = dynameh.requestBuilder.buildQueryInput(tableSchema2, `User/${userId}`);
            return dynameh.queryHelper.queryAll(dynamodb, userQueryReq);
        }))).flat();

    const accountTestQueryReq = dynameh.requestBuilder.buildQueryInput(tableSchema, `Account/${accountId}-TEST`);
    const accountTestRes: AccountObject[] = await dynameh.queryHelper.queryAll(dynamodb, accountTestQueryReq);

    await writeDownload(accountId, `edhi`, [
        ...accountRes,
        ...userRes,
        ...accountTestRes
    ]);
}

function getAccountUserIds(accountObjects: AccountObject[]): string[] {
    return accountObjects
        .filter(accountObject =>
            accountObject.pk.startsWith("Account/")
            && accountObject.sk.startsWith("AccountUser/")
        )
        .map(accountObject => accountObject.userId);
}
