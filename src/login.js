const config = require("./constants/appConstants");
const jwt = require("jsonwebtoken");

module.exports.handler = async (event) => {
  const user = JSON.parse(event.body);
  validateRequest(user);
  try {
    const accessToken = signToken(user);
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Login successful",
          accessToken,
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

const validateRequest = ({ username }) => {
  if (username === "") {
    throw new Error("Username can't be empty");
  }
  if (!username) {
    throw new Error("Body can't be empty");
  }
  if (username.length <= config.MIN_USERNAME_LENGTH) {
    throw new Error(
      `Username must be at least ${
        config.MIN_USERNAME_LENGTH + 1
      } characters long`,
    );
  }
};

const signToken = (user) => {
  return jwt.sign(user, config.JWT_SECRET, {
    expiresIn: config.JWT_TOKEN_EXPIRATION,
  });
};
