"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");

const dbName = "COMP2800";

const connectionParams = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const port = 8000;

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
  connectionParams,
  port,
  saltRounds,
<<<<<<< HEAD
  users,
};
=======
  users
};
>>>>>>> 3113a3e (Validated the HTML document, connected logo.js and logo.css)
