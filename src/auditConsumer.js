import config from "./constant/appConstants.js";
import { getObject } from "./getObject.js";
import { putObject } from "./putObject.js";

const getTimeStamp = (sentTimestamp) =>
  `[${new Date(+sentTimestamp).toLocaleString().split(", ").join(" - ")}]`;

const composeNewData = (event) =>
  event.Records.reduce((data, record) => {
    const { body, attributes } = record;
    const { SentTimestamp } = attributes;
    const timeStamp = getTimeStamp(SentTimestamp);
    return `${data}${timeStamp}: ${body}\n`;
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
  event.Records.forEach((record) => {
    console.log(record);
    const { body } = record;
    const { requestBody } = JSON.parse(body);
    const { enqueueDLQ } = JSON.parse(requestBody);
    if (enqueueDLQ) {
      throw new Error("Enqueue DLQ triggered");
    }
  });
  const existingData = await getExistingData();
  const newData = composeNewData(event);
  const data = existingData + newData;
  await putObject({
    bucketName: config.S3_LOCAL_BUCKET_NAME,
    data,
    objectKey: config.S3_AUDIT_OBJECT_KEY,
  });
}
