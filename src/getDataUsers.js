import { createRequire } from "module";
import { config, statuses } from "./constant/appConstants.js";
import { sendMessage } from "./sendMessage.js";

const require = createRequire(import.meta.url);
const users = require("./data/users.json");

export async function handler(event) {
  const statusCode = 200;
  sendMessage({
    event,
    queueName: config.SQS_QUEUE_NAME,
    status: statuses.SUCCESS,
    statusCode,
  });
  return {
    body: JSON.stringify({
      users,
    }),
    statusCode,
  };
}
