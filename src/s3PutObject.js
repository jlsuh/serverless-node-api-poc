const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  const { bucketName } = event.pathParameters;
  const requestBody = JSON.parse(event.body);
  let body, statusCode;
  try {
    validateRequest(requestBody, bucketName);
    const putObjectCommandOutput = await putObject({
      bucketName,
      ...requestBody,
    });
    statusCode = putObjectCommandOutput.$metadata.httpStatusCode;
    body = JSON.stringify({
      message:
        statusCode === 200
          ? "Successful object upload"
          : "Error while uploading object",
    });
  } catch (error) {
    body = JSON.stringify({
      error: error.message,
    });
    statusCode = 422;
  }
  return {
    statusCode,
    body,
  };
};

const putObject = async ({ bucketName, data, objectKey }) => {
  return s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: Buffer.from(JSON.stringify(data)),
    }),
  );
};

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
