const { S3Client } = require("@aws-sdk/client-s3");
const config = require("./constant/appConstants");

module.exports.s3Client = new S3Client({
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: `${config.APP_BASE_URI}:${config.S3_PORT}`,
});
