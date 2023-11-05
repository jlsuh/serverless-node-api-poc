const config = require("./constants/appConstants");
const jwt = require("jsonwebtoken");

module.exports.handler = async (event) => {
  const user = JSON.parse(event.body);
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Login successful",
          accessToken: signToken(user),
        },
        null,
        2,
      ),
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
  if (user.username.length <= config.MIN_USERNAME_LENGTH) {
    throw new Error(
      `Username must be at least ${
        config.MIN_USERNAME_LENGTH + 1
      } characters long`,
    );
  }
  return jwt.sign(user, config.JWT_SECRET, {
    expiresIn: 86400,
  });
};
