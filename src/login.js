import jwt from "jsonwebtoken";
import { config, statuses } from "./constant/appConstants.js";
import sendMessage from "./sendMessage.js";

export async function handler(event) {
  let statusCode = 200;
  try {
    const requestBody = JSON.parse(event.body);
    validateRequest(requestBody);
    return {
      body: JSON.stringify({
        accessToken: signToken(requestBody),
      }),
      statusCode,
    };
  } catch (error) {
    statusCode = 401;
    return {
      body: JSON.stringify({
        error: error.message,
      }),
      headers: {
        "WWW-Authenticate": "Bearer realm=localhost",
      },
      statusCode,
    };
  } finally {
    sendMessage({
      event,
      queueName: config.SQS_QUEUE_NAME,
      status: statuses.SUCCESS,
      statusCode,
    });
  }
}

const signToken = (requestBody) =>
  jwt.sign(requestBody, config.JWT_SECRET, {
    expiresIn: config.JWT_TOKEN_EXPIRATION,
  });

const validateRequest = (requestBody) => {
  if (!requestBody) {
    throw new Error("Request body is required");
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
