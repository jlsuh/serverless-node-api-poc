const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  const { bucketName } = event.pathParameters;
  const requestBody = JSON.parse(event.body);
  let body,
    statusCode = 200;
  try {
    validateRequest(requestBody, bucketName);
    putObject({
      bucketName,
      ...requestBody,
    });
    body = JSON.stringify({
      message: "Successful object upload",
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

const putObject = async ({ bucketName, data, objectKey }) =>
  await s3Client.send(
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
