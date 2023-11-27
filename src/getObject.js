import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./clients.js";

export const getObject = async ({ bucketName, objectName }) =>
  s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    }),
  );
