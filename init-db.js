"use strict";

const mysql = require("mysql2/promise");

const { dbName, dbUserTable, connectionParams, users, questions, choices } = require("./constants");

async function initDB() {
  const {database, ...connectWithoutDB} = connectionParams;
  const connection = await mysql.createConnection({
    ...connectWithoutDB,
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
    );
    CREATE TABLE IF NOT EXISTS QUESTION (
      ID int NOT NULL AUTO_INCREMENT,
      question varchar(300),
      PRIMARY KEY (ID)
    );
    CREATE TABLE IF NOT EXISTS CHOICE (
      ID int NOT NULL AUTO_INCREMENT,
      question_id int NOT NULL,
      text varchar(100),
      env_pt int(10),
      com_pt int(10),
      next_q int(10),
      PRIMARY KEY (ID)
    );`;
  await connection.query(query);

  const [userRows] = await connection.query(`SELECT * FROM ${dbUserTable}`);
  if (userRows.length == 0) {
    const insertUsers = `INSERT INTO ${dbUserTable} (name, email, password, role) values ?`;
    await connection.query(insertUsers, [users]);
  }

  const [questionRows] = await connection.query("SELECT * FROM QUESTION");
  if (questionRows.length == 0) {
    const insertQuestion = `INSERT INTO QUESTION (question) values ?`;
    await connection.query(insertQuestion, [questions]);
  }

  const [choiceRows] = await connection.query("SELECT * FROM CHOICE");
  if (choiceRows.length == 0) {
    const insertChoice = `INSERT INTO CHOICE (question_id, text, env_pt, com_pt, next_q) values ?`;
    await connection.query(insertChoice, [choices]);
  }
}

initDB().then(() => {
  console.info("DB initiated.");
  process.exit();
});
