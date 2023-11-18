import { S3Client } from "@aws-sdk/client-s3";
import config from "./constant/appConstants.js";

export default new S3Client({
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: `${config.BASE_URI}:${config.S3_PORT}`,
});
