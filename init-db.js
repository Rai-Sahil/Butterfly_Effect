"use strict";

const mysql = require("mysql2/promise");

const { dbName, dbUserTable, connectionParams, users } = require("./constants");

async function initDB() {
  const connection = await mysql.createConnection({
    ...connectionParams,
    multipleStatements: true,
  });

  const query = `
    CREATE DATABASE IF NOT EXISTS ${dbName};
    use ${dbName};
    CREATE TABLE IF NOT EXISTS ${dbUserTable} (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      uuid varchar(40) DEFAULT (uuid()) NOT NULL,
      name varchar(30),
      email varchar(30),
      password varchar(60),
      role varchar(30) DEFAULT 'user'
    );`;
  await connection.query(query);

  const [userRows] = await connection.query(`SELECT * FROM ${dbUserTable}`);

  if (userRows.length == 0) {
    const insertUsers = `INSERT INTO ${dbUserTable} (name, email, password, role) values ?`;
    await connection.query(insertUsers, [users]);
  }
}

initDB().then(() => {
  console.info("DB initiated.");
  process.exit();
});
