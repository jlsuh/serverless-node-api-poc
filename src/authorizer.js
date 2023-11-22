import jwt from "jsonwebtoken";
import config from "./constant/appConstants.js";

export async function handler(event) {
  try {
    const token = event.authorizationToken.replace(/Bearer /g, "");
    const secret = config.JWT_SECRET;
    const { username } = jwt.verify(token, secret);
    return allowPolicy(username, event.methodArn);
  } catch (error) {
    return denyPolicy("anonymous", event.methodArn);
  }
}

const generatePolicy = (principalId, effect, resource) => {
  return {
    principalId,
    policyDocument: {
      Version: config.POLICY_API_VERSION,
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

const denyPolicy = (principalId, resource) =>
  generatePolicy(principalId, "Deny", resource);

const allowPolicy = (principalId, resource) =>
  generatePolicy(principalId, "Allow", resource);
