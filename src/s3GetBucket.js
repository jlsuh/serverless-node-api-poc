const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  let body,
    statusCode = 200;
  try {
    const { bucketName } = event.pathParameters;
    const { KeyCount, Contents } = listObjects(bucketName);
    body = JSON.stringify(
      !!KeyCount
        ? {
            keys: Contents.map((content) => `${content.Key}`),
          }
        : {
            message: `Bucket '${bucketName}' is empty`,
          },
    );
  } catch (error) {
    body = JSON.stringify({
      error: error.message,
    });
    statusCode = error.statusCode;
  }
  return {
    statusCode,
    body,
  };
};

const listObjects = async (bucketName) => {
  return await s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
    }),
  );
};
