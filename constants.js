require("dotenv").config();

const dbName = "bby32";

const connectionParams = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const port = 8000;

// name | email | password | role
const users = [
  ["Thomas Anderson", "admin@bby32.com", process.env.ADMIN_PASSWORD, "admin"],
  ["John Doe", "user@bby32.com", process.env.USER_PASSWORD, "user"],
];

module.exports = {
  dbName,
  connectionParams,
  port,
  users
};
