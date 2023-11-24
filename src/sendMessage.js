import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { getQueueUrl } from "./getQueueURL.js";
import sqsClient from "./sqsClient.js";

export async function sendMessage(event, statusCode, queueName) {
  try {
    const { body, requestContext } = event;
    const { path } = requestContext;
    const { QueueUrl } = await getQueueUrl(queueName);
    const command = new SendMessageCommand({
      QueueUrl,
      DelaySeconds: 0,
      MessageBody: JSON.stringify({
        path,
        requestBody: body,
        statusCode,
      }),
    });
    return await sqsClient.send(command);
  } catch (error) {
    return {
      body: JSON.stringify({
        error: error.message,
      }),
      statusCode: error.$metadata.httpStatusCode,
    };
  }
}
