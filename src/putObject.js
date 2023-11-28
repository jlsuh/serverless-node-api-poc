import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./clients.js";

const putObject = async ({ bucketName, data, objectKey }) =>
  s3Client.send(
    new PutObjectCommand({
      Body: Buffer.from(JSON.stringify(data)),
      Bucket: bucketName,
      ContentType: "text/plain",
      Key: objectKey,
    }),
  );

export default putObject;
