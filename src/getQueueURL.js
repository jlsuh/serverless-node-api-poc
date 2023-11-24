import { GetQueueUrlCommand } from "@aws-sdk/client-sqs";
import sqsClient from "./sqsClient.js";

export const getQueueUrl = async (QueueName) =>
  await sqsClient.send(new GetQueueUrlCommand({ QueueName }));
