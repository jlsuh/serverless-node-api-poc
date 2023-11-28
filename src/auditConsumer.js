import writeAuditLog from "./writeAuditLog.js";

/*
const simulateDLQTrigger = () => {
  const random = Math.random();
  console.log(`>>>>>>>>>> [DLQ %] <${random}> <<<<<<<<<<`);
  if (random > 0.8) {
    throw new Error("DLQ triggered.");
  }
};
*/

export async function handler(event) {
  // simulateDLQTrigger();
  writeAuditLog(event);
}
