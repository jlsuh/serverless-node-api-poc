const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  try {
    const { bucketName, objectName } = event.pathParameters;
    const object = await getObject(bucketName, objectName);
    const objectData = JSON.parse(await object.Body.transformToString());
    return {
      body: JSON.stringify({
        ...objectData,
      }),
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

const getObject = async (bucketName, objectName) =>
  s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    }),
  );
