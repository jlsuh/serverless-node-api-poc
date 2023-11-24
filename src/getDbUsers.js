import config from "./constant/appConstants.js";
import { query } from "./db/index.js";
import { sendMessage } from "./sendMessage.js";

const QUERY = `SELECT * FROM ${config.POSTGRES_SCHEMA_NAME}.user`;

export async function handler(event) {
  let statusCode = 200;
  try {
    const { rows: users } = await query(QUERY);
    return {
      body: JSON.stringify({
        users,
      }),
      statusCode,
    };
  } catch (error) {
    statusCode = 500;
    return {
      body: JSON.stringify({
        error: "Internal Server Error",
      }),
      statusCode,
    };
  } finally {
    sendMessage(event, statusCode, config.SQS_OFFLINE_QUEUE_NAME);
  }
}
