import config from "./constant/appConstants.js";
import { putObject } from "./putObject.js";
import { sendMessage } from "./sendMessage.js";

export async function handler(event) {
  let statusCode = 200;
  try {
    const { bucketName } = event.pathParameters;
    const requestBody = JSON.parse(event.body);
    validateRequest({ bucketName, requestBody });
    await putObject({
      bucketName,
      ...requestBody,
    });
    return {
      body: JSON.stringify({
        message: "Successful object upload",
      }),
      statusCode,
    };
  } catch (error) {
    statusCode = error?.$metadata?.httpStatusCode ?? 422;
    return {
      body: JSON.stringify({
        error: error.message,
      }),
      statusCode,
    };
  } finally {
    sendMessage(event, statusCode, config.SQS_QUEUE_NAME);
  }
}

const validateRequest = ({ bucketName, requestBody }) => {
  if (!requestBody) {
    throw new Error("Request body is required");
  }
  if (Object.keys(requestBody).length === 0) {
    throw new Error("Request body can't be empty");
  }
  if (!bucketName) {
    throw new Error("Bucket name is required");
  }
  const { data, objectKey } = requestBody;
  if (!data) {
    throw new Error("Data is required");
  }
  if (!objectKey) {
    throw new Error("Object key is required");
  }
};
