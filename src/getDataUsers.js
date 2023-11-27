import { createRequire } from "module";
import config from "./constant/appConstants.js";
import { sendMessage } from "./sendMessage.js";

const require = createRequire(import.meta.url);
const users = require("./data/users.json");

export async function handler(event) {
  const statusCode = 200;
  sendMessage(event, statusCode, config.SQS_QUEUE_NAME);
  return {
    body: JSON.stringify({
      users,
    }),
    statusCode,
  };
}
