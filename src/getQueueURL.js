import { GetQueueUrlCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./clients.js";

export const getQueueUrl = async (QueueName) =>
  await sqsClient.send(new GetQueueUrlCommand({ QueueName }));
