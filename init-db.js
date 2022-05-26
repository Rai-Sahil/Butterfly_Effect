"use strict";

const mysql = require("mysql2/promise");

const { dbName, dbUserTable, connectionParams, users, questions, choices, endings } = require("./constants");

async function initDB() {
  const {database, ...connectWithoutDB} = connectionParams;
  const connection = await mysql.createConnection({
    ...connectWithoutDB,
    multipleStatements: true,
  });
  const createDBQuery = `CREATE DATABASE IF NOT EXISTS ${dbName};`;

  const query = `
    use ${dbName};
    SET FOREIGN_KEY_CHECKS=0;
    DROP TABLE IF EXISTS ${dbUserTable}, QUESTION, CHOICE, PLAYTHROUGH, PLAYTHROUGH_QUESTION, ENDING, EARNED_ENDING;
    CREATE TABLE IF NOT EXISTS ${dbUserTable} (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      uuid varchar(40) DEFAULT (uuid()) NOT NULL,
      name varchar(30),
      email varchar(30),
      password varchar(60),
      role enum('user', 'admin') NOT NULL
    );
    CREATE TABLE IF NOT EXISTS QUESTION (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      question varchar(300)
    );
    CREATE TABLE IF NOT EXISTS CHOICE (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      question_id int NOT NULL,
      text varchar(100),
      env_pt int(10),
      com_pt int(10),
      FOREIGN KEY (question_id) REFERENCES QUESTION(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS PLAYTHROUGH (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      is_complete bool DEFAULT FALSE NOT NULL,
      user_id int NOT NULL,
      current_question_id int,
      FOREIGN KEY (user_id) REFERENCES ${dbUserTable}(id) ON DELETE CASCADE
      );
    CREATE TABLE IF NOT EXISTS PLAYTHROUGH_QUESTION (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      playthrough_id int NOT NULL,
      question_id int NOT NULL,
      selected_choice_id int,
      FOREIGN KEY (playthrough_id) REFERENCES PLAYTHROUGH(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES QUESTION(id) ON DELETE CASCADE,
      FOREIGN KEY (selected_choice_id) REFERENCES CHOICE(id) ON DELETE CASCADE
    );
    ALTER TABLE PLAYTHROUGH ADD CONSTRAINT FK_PTQ
      FOREIGN KEY (current_question_id)
      REFERENCES PLAYTHROUGH_QUESTION (id)
      ON DELETE CASCADE;
    CREATE TABLE IF NOT EXISTS ENDING (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      type enum('comfort', 'environment') NOT NULL,
      threshold int NOT NULL,
      text varchar(500)
    );
    ALTER TABLE ENDING ADD CONSTRAINT UQ_type_threshold UNIQUE(type, threshold);
    CREATE TABLE IF NOT EXISTS EARNED_ENDING (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id int NOT NULL,
      playthrough_id int NOT NULL,
      ending_id int NOT NULL,
      earned_points int NOT NULL,
      FOREIGN KEY (user_id) REFERENCES ${dbUserTable}(id) ON DELETE CASCADE,
      FOREIGN KEY (playthrough_id) REFERENCES PLAYTHROUGH(id) ON DELETE CASCADE,
      FOREIGN KEY (ending_id) REFERENCES ENDING(id) ON DELETE CASCADE
    );
    SET FOREIGN_KEY_CHECKS=1;`;
  await connection.query(createDBQuery);
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
    const insertChoice = `INSERT INTO CHOICE (question_id, text, env_pt, com_pt) values ?`;
    await connection.query(insertChoice, [choices]);
  }

  const [endingRows] = await connection.query("SELECT * FROM ENDING");
  if (endingRows.length == 0) {
    const insertEnding = `INSERT INTO ENDING (type, threshold, text) values ?`;
    await connection.query(insertEnding, [endings]);
  }
  connection.close();
}

initDB().then(() => {
  console.info("DB initiated.");
  process.exit();
});