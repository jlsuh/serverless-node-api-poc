import { SQSClient } from "@aws-sdk/client-sqs";
import config from "./constant/appConstants.js";

export default new SQSClient({
  endpoint: `${config.BASE_URI}:${config.SQS_HOST_PORT}`,
  forcePathStyle: true,
});
