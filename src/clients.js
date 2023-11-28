import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";
import { config } from "./constant/appConstants.js";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: `${config.BASE_URI}:${config.S3_PORT}`,
  forcePathStyle: true,
});

const sqsClient = new SQSClient({
  endpoint: `${config.BASE_URI}:${config.SQS_HOST_PORT}`,
  forcePathStyle: true,
});

export { s3Client, sqsClient };
