const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");

module.exports.handler = (_, __, callback) => {
  s3Client
    .send(
      new PutObjectCommand({
        Bucket: "local-bucket",
        Key: "1234",
        Body: Buffer.from("abcd"),
      }),
    )
    .then(() => callback(null, "Success"))
    .catch((err) => callback(err));
};
