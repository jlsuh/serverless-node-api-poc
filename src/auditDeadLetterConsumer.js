import { statuses } from "./constant/appConstants.js";
import { writeAuditLog } from "./writeAuditLog.js";

export async function handler(event) {
  const failedEvent = {
    ...event,
    Records: event.Records.map((record) => ({
      ...record,
      body: JSON.stringify({
        ...JSON.parse(record.body),
        status: statuses.FAILURE,
      }),
    })),
  };
  writeAuditLog(failedEvent);
}
