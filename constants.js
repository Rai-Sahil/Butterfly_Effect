require("dotenv").config();

const dbName = "bby32";

const connectionParams = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const port = 8000;

module.exports = {
  dbName,
  connectionParams,
  port
};
