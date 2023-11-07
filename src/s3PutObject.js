const {
  PutObjectCommand,
  HeadBucketCommand,
  NotFound,
} = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  const { bucketName } = event.pathParameters;
  const requestBody = JSON.parse(event.body);
  try {
    await validateRequest(requestBody, bucketName);
    const putObjectCommandOutput = await putObject({
      bucketName,
      ...requestBody,
    });
    const statusCode = putObjectCommandOutput.$metadata.httpStatusCode;
    return {
      statusCode,
      body: JSON.stringify({
        message:
          statusCode === 200
            ? "Successful object upload"
            : "Error while uploading object",
      }),
    };
  } catch (error) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
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

const validateRequest = async (requestBody, bucketName) => {
  if (!requestBody) {
    throw new Error("Request body can't be empty");
  }
  if (!bucketName) {
    throw new Error("Bucket name can't be empty");
  }
  const { data, objectKey } = requestBody;
  if (!data) {
    throw new Error("Data can't be empty");
  }
  if (!(await checkBucketExists(bucketName))) {
    throw new Error(`No bucket found for '${bucketName}'`);
  }
  if (!objectKey) {
    throw new Error("Object key can't be empty");
  }
};

const checkBucketExists = async (bucketName) => {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch (error) {
    if (error instanceof NotFound) {
      return false;
    }
    throw new Error("Unidentified error");
  }
};
