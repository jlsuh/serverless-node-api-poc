const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = async (event) => {
  const { bucketName, objectName } = event.pathParameters;
  let body,
    statusCode = 200;
  try {
    const object = await getObject(bucketName, objectName);
    const objectData = JSON.parse(await object.Body.transformToString());
    body = JSON.stringify({
      ...objectData,
    });
  } catch (error) {
    body = JSON.stringify({
      error: error.message,
    });
    statusCode = error.$metadata.httpStatusCode;
  }
  return {
    statusCode,
    body,
  };
};

const getObject = (bucketName, objectName) =>
  s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    }),
  );
