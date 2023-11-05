const config = require("./constants/appConstants");
const jwt = require("jsonwebtoken");

module.exports.handler = (event, _, callback) => {
  const token = event.authorizationToken.replace(/Bearer /g, "");
  const secret = config.JWT_SECRET;
  jwt.verify(token, secret, (err) => {
    if (err) {
      callback(null, denyPolicy("anonymous", event.methodArn));
    } else {
      const { username } = jwt.decode(token);
      callback(null, allowPolicy(username, event.methodArn));
    }
  });
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

const denyPolicy = (principalId, resource) => {
  return generatePolicy(principalId, "Deny", resource);
};

const allowPolicy = (principalId, resource) => {
  return generatePolicy(principalId, "Allow", resource);
};
