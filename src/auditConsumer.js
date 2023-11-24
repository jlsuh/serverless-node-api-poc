import config from "./constant/appConstants.js";
import { getObject } from "./getObject.js";
import { putObject } from "./putObject.js";

const getTimeStamp = (sentTimestamp) =>
  `[${new Date(+sentTimestamp).toLocaleString().split(", ").join(" - ")}]`;

const composeNewContent = (event) =>
  event.Records.reduce((content, record) => {
    const { body, attributes } = record;
    const { SentTimestamp } = attributes;
    const timeStamp = getTimeStamp(SentTimestamp);
    return `${content}${timeStamp}: ${body}\n`;
  }, "");

const getExistingData = async () => {
  try {
    const object = await getObject({
      bucketName: config.S3_LOCAL_BUCKET_NAME,
      objectName: config.S3_AUDIT_OBJECT_KEY,
    });
    return JSON.parse(await object.Body.transformToString());
  } catch (error) {
    return "";
  }
};

export async function handler(event) {
  const existingData = await getExistingData();
  const newData = composeNewContent(event);
  const data = existingData + newData;
  await putObject({
    bucketName: config.S3_LOCAL_BUCKET_NAME,
    data,
    objectKey: config.S3_AUDIT_OBJECT_KEY,
  });
}
