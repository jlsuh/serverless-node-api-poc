const { query } = require("./db/index");

const QUERY = "SELECT * FROM serverless_node_api.user";

module.exports.handler = async () => {
  try {
    const { rows: users } = await query(QUERY);
    return {
      body: JSON.stringify({
        users,
      }),
      statusCode: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify({
        error: "Internal Server Error",
      }),
      statusCode: 500,
    };
  }
};
