import { SendMessageCommand } from "@aws-sdk/client-sqs";
import sqsClient from "./sqsClient.js";
import { sqsGetQueueUrl } from "./sqsGetQueueURL.js";

export async function sqsSendMessage(event, statusCode, queueName) {
  const { body: requestBody, requestContext } = event;
  const { path } = requestContext;
  const { QueueUrl } = await sqsGetQueueUrl(queueName);
  const command = new SendMessageCommand({
    QueueUrl,
    DelaySeconds: 0,
    MessageBody: JSON.stringify({
      path,
      requestBody,
      statusCode,
    }),
  });
  try {
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
