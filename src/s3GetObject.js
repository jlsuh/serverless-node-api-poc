const { GetObjectCommand } = require("@aws-sdk/client-s3");
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
    const objectData = JSON.parse(
      await getObjectCommandOutput.Body.transformToString(),
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...objectData,
      }),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
