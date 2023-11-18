import { createRequire } from "module";
const require = createRequire(import.meta.url);
const users = require("./data/users.json");

export async function handler() {
  return {
    body: JSON.stringify({
      users,
    }),
    statusCode: 200,
  };
}
