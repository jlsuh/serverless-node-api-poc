import { createRequire } from "module";
import { config } from "../constant/appConstants.js";
import { getClient } from "./index.js";

const require = createRequire(import.meta.url);
const users = require("../data/users.json");

const SCHEMA = config.POSTGRES_SCHEMA_NAME;

export async function handler() {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    await client.query(`DROP SCHEMA IF EXISTS ${SCHEMA} CASCADE`);
    await client.query(`CREATE SCHEMA ${SCHEMA}`);
    await createUsers(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

const createUsers = async (client) => {
  const TABLE = "user";
  await client.query(
    `CREATE TABLE ${SCHEMA}.${TABLE}
      (
          id       SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          fullname VARCHAR(100) NOT NULL
      )`,
  );
  await client.query(
    `INSERT INTO ${SCHEMA}.${TABLE} (username, fullname)
      SELECT "${TABLE}".username, "${TABLE}".fullname
      FROM json_to_recordset($1) AS "${TABLE}"(username VARCHAR(100), fullname VARCHAR(100))`,
    [JSON.stringify(users)],
  );
};
