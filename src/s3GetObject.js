const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  const { bucketName, objectName } = event.pathParameters;
  let body,
    statusCode = 200;
  try {
    const getObjectCommandOutput = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName,
      }),
    );
    const objectData = JSON.parse(
      await getObjectCommandOutput.Body.transformToString(),
    );
    body = JSON.stringify({
      ...objectData,
    });
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
