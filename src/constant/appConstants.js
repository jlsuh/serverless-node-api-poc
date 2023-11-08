const APP_BASE_URI = process.env.APP_BASE_URI;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TOKEN_EXPIRATION = process.env.JWT_TOKEN_EXPIRATION;
const MIN_USERNAME_LENGTH = +process.env.MIN_USERNAME_LENGTH;
const POLICY_LANGUAGE_VERSION = process.env.POLICY_LANGUAGE_VERSION;
const POSTGRES_DB = process.env.POSTGRES_DB;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_HOST_PORT = process.env.POSTGRES_HOST_PORT;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_USER = process.env.POSTGRES_USER;
const S3_PORT = process.env.S3_PORT;

module.exports = Object.freeze({
  APP_BASE_URI,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  JWT_SECRET,
  JWT_TOKEN_EXPIRATION,
  MIN_USERNAME_LENGTH,
  POLICY_LANGUAGE_VERSION,
  POSTGRES_DB,
  POSTGRES_HOST_PORT,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  S3_PORT,
});
