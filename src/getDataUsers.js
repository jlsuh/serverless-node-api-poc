const users = require("./data/users");

module.exports.handler = async () => {
  return {
    body: JSON.stringify({
      users,
    }),
    statusCode: 200,
  };
};
