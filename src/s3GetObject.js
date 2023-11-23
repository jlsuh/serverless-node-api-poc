import { GetObjectCommand } from "@aws-sdk/client-s3";
import config from "./constant/appConstants.js";
import s3Client from "./s3Client.js";
import { sqsSendMessage } from "./sqsSendMessage.js";

export async function handler(event) {
  let statusCode = 200;
  try {
    const { bucketName, objectName } = event.pathParameters;
    const object = await getObject(bucketName, objectName);
    const objectData = JSON.parse(await object.Body.transformToString());
    return {
      body: JSON.stringify({
        ...objectData,
      }),
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
    sqsSendMessage(event, statusCode, config.SQS_OFFLINE_QUEUE_NAME);
  }
}

const getObject = (bucketName, objectName) =>
  s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    }),
  );
