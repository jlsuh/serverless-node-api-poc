import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "./clients.js";

export const listObjects = async (bucketName) =>
  s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
    }),
  );
