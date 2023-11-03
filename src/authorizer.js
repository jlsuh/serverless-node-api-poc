const jwt = require("jsonwebtoken");

module.exports.handler = (event, _, callback) => {
  const token = event.authorizationToken.replace(/Bearer /g, "");
  const secret = process.env.JWT_SECRET;
  const { username } = jwt.decode(token);
  jwt.verify(token, secret, (err) => {
    if (err) {
      console.error("JWT Error", err, err.stack);
      callback(null, denyPolicy("anonymous", event.methodArn));
    } else {
      callback(null, allowPolicy(username, event.methodArn));
    }
  });
};

const generatePolicy = (principalId, effect, resource) => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
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
