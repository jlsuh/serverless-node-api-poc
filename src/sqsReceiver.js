import config from "./constant/appConstants.js";
import { getObject } from "./getObject.js";
import { putObject } from "./putObject.js";

const getTimeStamp = (sentTimestamp) =>
  `[${new Date(+sentTimestamp).toLocaleString().split(", ").join(" - ")}]`;

const composeNewContent = (event) => {
  return event.Records.reduce((content, record) => {
    const { body, attributes } = record;
    const { SentTimestamp } = attributes;
    const timeStamp = getTimeStamp(SentTimestamp);
    return `${content}${timeStamp}: ${body}\n`;
  }, "");
};

const getExistingData = async () => {
  try {
    const object = await getObject(
      config.S3_LOCAL_BUCKET_NAME,
      config.S3_AUDIT_OBJECT_KEY,
    );
    return JSON.parse(await object.Body.transformToString());
  } catch (error) {
    return "";
  }
};

export async function handler(event) {
  const existingData = await getExistingData();
  const newData = composeNewContent(event);
  console.log(">> Existing:");
  console.log(existingData);
  console.log(">> New:");
  console.log(newData);
  const data = existingData + newData;
  await putObject({
    bucketName: config.S3_LOCAL_BUCKET_NAME,
    data,
    objectKey: config.S3_AUDIT_OBJECT_KEY,
  });
}
