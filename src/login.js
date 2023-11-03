const jwt = require("jsonwebtoken");

module.exports.handler = async (event) => {
  const user = JSON.parse(event.body);
  try {
    return {
      statusCode: 200,
      headers: {
        access_token: signToken(user),
      },
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers: {
        "WWW-Authenticate": "Bearer realm=localhost",
      },
      body: JSON.stringify(
        {
          message: "Login failed",
          error: error.message,
        },
        null,
        2,
      ),
    };
  }
};

const signToken = (user) => {
  if (user.username === "") {
    throw new Error("Username can't be empty");
  }
  if (!user.username) {
    throw new Error("Body can't be empty");
  }
  if (user.username.length <= 3) {
    throw new Error("Username must be at least 3 characters long");
  }
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: 86400,
  });
};
