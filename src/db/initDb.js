const { getClient } = require("./index");
const users = require("../data/users");

module.exports.handler = async () => {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    await client.query("DROP SCHEMA IF EXISTS serverless_node_api CASCADE");
    await client.query("CREATE SCHEMA serverless_node_api");
    await client.query(
      `CREATE TABLE serverless_node_api.user
      (
          id       SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          fullname VARCHAR(100) NOT NULL
      )`,
    );
    await client.query(
      `INSERT INTO serverless_node_api.user (username, fullname)
      SELECT x.username, x.fullname
      FROM json_to_recordset($1) AS x(username VARCHAR(100), fullname VARCHAR(100))`,
      [JSON.stringify(users)],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
