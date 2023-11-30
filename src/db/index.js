import pkg from "pg";
import { config } from "../constant/appConstants.js";
const { Pool } = pkg;

const pool = new Pool({
  database: config.POSTGRES_DB,
  host: config.POSTGRES_HOST,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_HOST_PORT,
  user: config.POSTGRES_USER,
});

const query = (text, params, callback) => pool.query(text, params, callback);

const getClient = () => pool.connect();

export { getClient, query };
