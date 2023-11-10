const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
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
};

const listObjects = async (bucketName) =>
  s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
    }),
  );
