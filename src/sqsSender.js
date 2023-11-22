import { SendMessageCommand } from "@aws-sdk/client-sqs";
import config from "./constant/appConstants.js";
import sqsClient from "./sqsClient.js";
import { getQueueUrl } from "./sqsGetQueueURL.js";

export async function handler() {
  const { QueueUrl } = await getQueueUrl(config.SQS_OFFLINE_QUEUE_NAME);
  const command = new SendMessageCommand({
    QueueUrl,
    DelaySeconds: 0,
    MessageAttributes: {
      Title: {
        DataType: "String",
        StringValue: "The Whistler",
      },
      Author: {
        DataType: "String",
        StringValue: "John Grisham",
      },
      WeeksOn: {
        DataType: "Number",
        StringValue: "6",
      },
    },
    MessageBody:
      "Information about current NY Times fiction bestseller for week of 12/11/2016.",
  });
  try {
    console.log(">>>>>>>>>>>>>>>>>>>> Sending message <<<<<<<<<<<<<<<<<<<<");
    return await sqsClient.send(command);
  } catch (error) {
    console.error(error);
  }
}
