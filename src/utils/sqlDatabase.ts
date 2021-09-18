import knex = require("knex");
import {askPassword} from "./commandLineInput";

export async function connectToSqlDatabase(): Promise<knex.Knex> {
    const username = "master";
    const question = `Database ${username} password? `
    const pw = await askPassword(question);
    try {
        const knex = await getKnex(username, pw, "localhost", "3306");
        // meaningless query to test connection
        await knex("Programs")
            .select("*")
            .limit(0);
        return knex;
    } catch (e) {
        console.log("An error occurred while connecting to the database. Please confirm you're entering the correct password, that your connected to the VPN, and tunneled into the database.");
        return connectToSqlDatabase();
    }
}

function getKnex(username: string, password: string, endpoint: string, port: string): knex.Knex {
    return knex.knex({
        // debug: true,     // uncomment to dump very verbose SQL statement info to console.log
        client: "mysql2",
        connection: {
            host: endpoint,
            port: +port,
            user: username,
            password: password,
            database: "rothschild",
            timezone: "Z",
            typeCast: function (field: any, next: any) {
                if (field.type === "TINY" && field.length === 1) {
                    // MySQL does not have a true boolean type.  Convert tinyint(1) to boolean.
                    const val = field.string();
                    if (val === null) {
                        return null;
                    } else {
                        return val === "1";
                    }
                }
                if (field.type === "DATETIME") {
                    const value = field.string();
                    if (!value) {
                        return null;
                    }
                    return new Date(value + "Z");
                }
                return next();
            }
        },
        pool: {
            min: 1,
            max: 1
        }
    });
}

export function formatDateForDB(date: Date): string {
    return date.toISOString().split('T')[0]
}
