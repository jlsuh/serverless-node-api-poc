import { createRequire } from "module";
import config from "./constant/appConstants.js";
import { sqsSendMessage } from "./sqsSendMessage.js";

const require = createRequire(import.meta.url);
const users = require("./data/users.json");

export async function handler(event) {
  const statusCode = 200;
  sqsSendMessage(event, statusCode, config.SQS_OFFLINE_QUEUE_NAME);
  return {
    body: JSON.stringify({
      users,
    }),
    statusCode,
  };
}
