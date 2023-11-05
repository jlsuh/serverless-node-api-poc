module.exports.handler = (event, context, callback) => {
  console.info("event:", JSON.stringify(event, null, 2));
  console.info("context:", JSON.stringify(context, null, 2));
  console.info("process.env:", JSON.stringify(process.env, null, 2));
  callback(null, "ok");
};
