const users = require("./data/users");

module.exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      users,
    }),
  };
};
