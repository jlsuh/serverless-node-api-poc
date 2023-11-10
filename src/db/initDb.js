const { getClient } = require("./index");
const users = require("../data/users");

const SCHEMA = "serverless_node_api";

module.exports.handler = async () => {
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
};

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
      SELECT x.username, x.fullname
      FROM json_to_recordset($1) AS x(username VARCHAR(100), fullname VARCHAR(100))`,
    [JSON.stringify(users)],
  );
};
