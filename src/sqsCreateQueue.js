import { CreateQueueCommand } from "@aws-sdk/client-sqs";
import config from "./constant/appConstants.js";
import sqsClient from "./sqsClient";

export async function handler() {
  const command = new CreateQueueCommand({
    QueueName: config.SQS_OFFLINE_QUEUE_NAME,
    Attributes: {
      MessageRetentionPeriod: "86400",
    },
  });
  return await sqsClient.send(command);
}
