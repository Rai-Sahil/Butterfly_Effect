"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

const dbName = process.env.DB_NAME || "COMP2800";

const dbUserTable = "BBY_32_USER";

const connectionParams = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: dbName,
};

const connection = mysql.createConnection(connectionParams).promise();

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

//question
const questions = [
  ["Should I turn on the A/C?"],
  ["Should I go there?"],
  ["What is carbon sink?"],
];

//question_id | text | environment | comfort | next_question
const choices = [
  [1, "Yes", -5, 5, 2],
  [1, "No", 0, -5, 2],
  [2, "Yes", 5, 5, 3],
  [2, "No", 0, -5, 3],
  [3, "Forest", 2, 0, 1],
  [3, "Soil", 2, 0, 1],
  [3, "Ocean", 2, 0, 1],
  [3, "All", 6, 0, 1],
];

// type | threshold | text
const endings = [
  ["comfort", 0, "this is comfort 0 ending"],
  ["comfort", 50, "this is comfort 50 ending"],
  ["comfort", 100, "this is comfort 100 ending"],
  ["environment", 0, "this is environment 0 ending"],
  ["environment", 50, "this is environment 50 ending"],
  ["environment", 100, "this is environment 100 ending"],
];

module.exports = {
  dbName,
  dbUserTable,
  connection,
  connectionParams,
  saltRounds,
  users,
  questions,
  choices,
  endings,
};
