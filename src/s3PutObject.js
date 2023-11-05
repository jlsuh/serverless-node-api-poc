const { PutObjectCommand, HeadBucketCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    await validateRequest(requestBody);
    const putObjectCommandOutput = await putObject(requestBody);
    const statusCode = putObjectCommandOutput.$metadata.httpStatusCode;
    return {
      statusCode,
      body: JSON.stringify(
        {
          message:
            statusCode === 200
              ? "Successful object upload"
              : "Error while uploading object",
        },
        null,
        2,
      ),
    };
  } catch (err) {
    return {
      statusCode: 422,
      body: JSON.stringify(
        {
          message: "Unprocessable entity",
          error: err.message,
        },
        null,
        2,
      ),
    };
  }
};

const putObject = async ({ bucketName, objectKey, data }) => {
  return s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: Buffer.from(JSON.stringify(data)),
    }),
  );
};

const validateRequest = async (requestBody) => {
  if (!requestBody) {
    throw new Error("Request body can't be empty");
  }
  const { data, bucketName, objectKey } = requestBody;
  if (!data) {
    throw new Error("Data can't be empty");
  }
  if (!bucketName) {
    throw new Error("Bucket name can't be empty");
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
  } catch (err) {
    if (err.$metadata.httpStatusCode === 404) {
      return false;
    }
    throw new Error("Unidentified error status code");
  }
};
