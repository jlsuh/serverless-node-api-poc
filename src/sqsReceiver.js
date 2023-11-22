import {
  DeleteMessageBatchCommand,
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from "@aws-sdk/client-sqs";
import config from "./constant/appConstants.js";
import sqsClient from "./sqsClient.js";
import { getQueueUrl } from "./sqsGetQueueURL.js";

const receiveMessage = (queueUrl) =>
  sqsClient.send(
    new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      QueueUrl: queueUrl,
    }),
  );

export async function handler() {
  const { QueueUrl } = await getQueueUrl(config.SQS_OFFLINE_QUEUE_NAME);
  const { Messages } = await receiveMessage(QueueUrl);
  if (!Messages) {
    return;
  }
  if (Messages.length === 1) {
    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl,
        ReceiptHandle: Messages[0].ReceiptHandle,
      }),
    );
  } else {
    await sqsClient.send(
      new DeleteMessageBatchCommand({
        QueueUrl,
        Entries: Messages.map((message) => ({
          Id: message.MessageId,
          ReceiptHandle: message.ReceiptHandle,
        })),
      }),
    );
  }
}
