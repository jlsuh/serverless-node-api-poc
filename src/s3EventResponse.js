module.exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2));
  console.log(JSON.stringify(context, null, 2));
  console.log(JSON.stringify(process.env, null, 2));
  callback(null, "ok");
};
