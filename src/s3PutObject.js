const { PutObjectCommand, HeadBucketCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event, _, callback) => {
  try {
    const requestBody = JSON.parse(event.body);
    await validateRequest(requestBody);
    await putObject(requestBody)
      .then(() => {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(
            {
              message: "Successful object upload",
            },
            null,
            2,
          ),
        });
      })
      .catch((err) =>
        callback(null, {
          statusCode: 503,
          body: JSON.stringify(
            {
              message: "Error uploading object",
              error: err.message,
            },
            null,
            2,
          ),
        }),
      );
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

const validateRequest = async ({ bucketName, objectKey, data }) => {
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
    if (err["$metadata"].httpStatusCode === 404) {
      return false;
    }
    throw new Error("Unidentified error status code");
  }
};
