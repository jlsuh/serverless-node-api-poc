const {
  GetObjectCommand,
  NoSuchKey,
  S3ServiceException,
} = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  const { bucketName, objectName } = event.pathParameters;
  try {
    const getObjectCommandOutput = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName,
      }),
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Object '${objectName}' found in bucket '${bucketName}'`,
      }),
    };
  } catch (error) {
    if (error instanceof NoSuchKey) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `No object found for '${objectName}' in '${bucketName}'`,
          error: error.message,
        }),
      };
    }
    if (error instanceof S3ServiceException) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `No bucket found for '${bucketName}'`,
          error: error.message,
        }),
      };
    }
    throw new Error("Unidentified error");
  }
};
