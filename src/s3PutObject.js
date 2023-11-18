import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client.js";

export async function handler(event) {
  try {
    const { bucketName } = event.pathParameters;
    const requestBody = JSON.parse(event.body);
    validateRequest(requestBody, bucketName);
    await putObject({
      bucketName,
      ...requestBody,
    });
    return {
      body: JSON.stringify({
        message: "Successful object upload",
      }),
      statusCode: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify({
        error: error.message,
      }),
      statusCode: error?.$metadata?.httpStatusCode ?? 422,
    };
  }
}

const putObject = ({ bucketName, data, objectKey }) =>
  s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: Buffer.from(JSON.stringify(data)),
    }),
  );

const validateRequest = (requestBody, bucketName) => {
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
