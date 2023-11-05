const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const S3_PORT = process.env.S3_PORT;

module.exports = Object.freeze({
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  JWT_SECRET,
  S3_PORT,
});
