import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client.js";

export async function handler(event) {
  try {
    const { bucketName, objectName } = event.pathParameters;
    const object = await getObject(bucketName, objectName);
    const objectData = JSON.parse(await object.Body.transformToString());
    return {
      body: JSON.stringify({
        ...objectData,
      }),
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

const getObject = (bucketName, objectName) =>
  s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    }),
  );
