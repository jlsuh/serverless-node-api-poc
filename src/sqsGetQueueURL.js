import { GetQueueUrlCommand } from "@aws-sdk/client-sqs";
import sqsClient from "./sqsClient.js";

export async function getQueueUrl(queueName) {
  const command = new GetQueueUrlCommand({ QueueName: queueName });
  return await sqsClient.send(command);
}
