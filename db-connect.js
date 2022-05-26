"use strict";

const { connectionParams } = require("./constants");

const mysql = require("mysql2");
const connection = mysql.createConnection(connectionParams).promise();
module.exports = { connection };