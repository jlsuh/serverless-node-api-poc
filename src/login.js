const config = require("./constant/appConstants");
const jwt = require("jsonwebtoken");

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    validateRequest(requestBody);
    const accessToken = signToken(requestBody);
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

const validateRequest = (requestBody) => {
  if (!requestBody) {
    throw new Error("Body can't be empty");
  }
  const { username } = requestBody;
  if (username === "") {
    throw new Error("Username can't be empty");
  }
  if (!username) {
    throw new Error("Username is required");
  }
  if (username.length <= config.MIN_USERNAME_LENGTH) {
    throw new Error(
      `Username must be at least ${
        config.MIN_USERNAME_LENGTH + 1
      } characters long`,
    );
  }
};

const signToken = (requestBody) =>
  jwt.sign(requestBody, config.JWT_SECRET, {
    expiresIn: config.JWT_TOKEN_EXPIRATION,
  });
