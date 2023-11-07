const { ListObjectsV2Command, NoSuchBucket } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  const { bucketName } = event.pathParameters;
  try {
    const listObjectsV2CommandOutput = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
      }),
    );
    const { KeyCount, Contents } = listObjectsV2CommandOutput;
    return !!KeyCount
      ? {
          statusCode: 200,
          body: JSON.stringify({
            message: `Bucket '${bucketName}' has ${KeyCount} object(s)`,
            keys: Contents.map((content) => `${content.Key}`),
          }),
        }
      : {
          statusCode: 200,
          body: JSON.stringify({
            message: `Bucket '${bucketName}' is empty`,
          }),
        };
  } catch (error) {
    if (error instanceof NoSuchBucket) {
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
