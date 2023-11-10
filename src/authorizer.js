const config = require("./constant/appConstants");
const jwt = require("jsonwebtoken");

module.exports.handler = async (event) => {
  try {
    const token = event.authorizationToken.replace(/Bearer /g, "");
    const secret = config.JWT_SECRET;
    const { username } = jwt.verify(token, secret);
    return allowPolicy(username, event.methodArn);
  } catch (error) {
    return denyPolicy("anonymous", event.methodArn);
  }
};

const generatePolicy = (principalId, effect, resource) => {
  return {
    principalId,
    policyDocument: {
      Version: config.POLICY_LANGUAGE_VERSION,
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
