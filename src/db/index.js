const { Pool } = require("pg");
const config = require("../constant/appConstants");

const pool = new Pool({
  database: config.POSTGRES_DB,
  host: config.POSTGRES_HOST,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_HOST_PORT,
  user: config.POSTGRES_USER,
});

module.exports = {
  query: async (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  getClient: async () => {
    return pool.connect();
  },
};
