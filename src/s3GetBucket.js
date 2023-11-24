import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import config from "./constant/appConstants.js";
import s3Client from "./s3Client.js";
import { sqsSendMessage } from "./sqsSendMessage.js";

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
    sqsSendMessage(event, statusCode, config.SQS_OFFLINE_QUEUE_NAME);
  }
}

const listObjects = async (bucketName) =>
  s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
    }),
  );
