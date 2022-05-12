"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");

const dbName = process.env.DB_NAME || "COMP2800";

const dbUserTable = "BBY_32_USER";

const connectionParams = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: dbName,
};

const saltRounds = 10;

// name | email | password | role
const users = [
  [
    "Thomas Anderson",
    "admin@bby32.com",
    bcrypt.hashSync(process.env.ADMIN_PASSWORD, saltRounds),
    "admin",
  ],
  [
    "John Doe",
    "user@bby32.com",
    bcrypt.hashSync(process.env.USER_PASSWORD, saltRounds),
    "user",
  ],
];

module.exports = {
  dbName,
  dbUserTable,
  connectionParams,
  saltRounds,
  users,
};
