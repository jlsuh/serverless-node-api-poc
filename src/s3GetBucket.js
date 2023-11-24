import config from "./constant/appConstants.js";
import { listObjects } from "./listObjects.js";
import { sendMessage } from "./sendMessage.js";

export async function handler(event) {
  let statusCode = 200;
  try {
    const { bucketName } = event.pathParameters;
    const { KeyCount, Contents } = await listObjects(bucketName);
    return {
      body: JSON.stringify(
        !!KeyCount
          ? {
              keys: Contents.map((content) => `${content.Key}`),
            }
          : {
              message: `Bucket '${bucketName}' is empty`,
            },
      ),
      statusCode,
    };
  } catch (error) {
    statusCode = error.$metadata.httpStatusCode;
    return {
      body: JSON.stringify({
        error: error.message,
      }),
      statusCode,
    };
  } finally {
    sendMessage(event, statusCode, config.SQS_OFFLINE_QUEUE_NAME);
  }
}
