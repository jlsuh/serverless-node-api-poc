import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3Client from "./s3Client.js";

export async function handler(event) {
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
      statusCode: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify({
        error: error.message,
      }),
      statusCode: error.$metadata.httpStatusCode,
    };
  }
}

const listObjects = (bucketName) =>
  s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
    }),
  );
