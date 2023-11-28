import { GetQueueUrlCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./clients.js";

const getQueueUrl = async (QueueName) =>
  await sqsClient.send(new GetQueueUrlCommand({ QueueName }));

export default getQueueUrl;
