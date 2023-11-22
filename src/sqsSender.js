import { SendMessageCommand } from "@aws-sdk/client-sqs";
import config from "./constant/appConstants.js";
import sqsClient from "./sqsClient.js";
import { getQueueUrl } from "./sqsGetQueueURL.js";

export async function handler() {
  const { QueueUrl } = await getQueueUrl(config.SQS_OFFLINE_QUEUE_NAME);
  const command = new SendMessageCommand({
    QueueUrl,
    MessageBody: JSON.stringify("Hello"),
  });
  try {
    return await sqsClient.send(command);
  } catch (error) {
    console.error(error);
  }
}
