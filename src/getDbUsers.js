const { query } = require("./db/index");

const QUERY = "SELECT * FROM serverless_node_api.user";

module.exports.handler = async () => {
  let body,
    statusCode = 200;
  try {
    const { rows: users } = await query(QUERY);
    body = JSON.stringify({
      users,
    });
  } catch (error) {
    body = JSON.stringify({
      error: "Internal Server Error",
    });
    statusCode = 500;
  }
  return {
    statusCode,
    body,
  };
};
