const mysql = require("mysql2/promise");

const {
  dbName,
  connectionParams,
  users
} = require("./constants");

async function initDB() {
  const connection = await mysql.createConnection({
    ...connectionParams,
    multipleStatements: true,
  });

  const query = `
    CREATE DATABASE IF NOT EXISTS ${dbName};
    use ${dbName};
    CREATE TABLE IF NOT EXISTS USER (
      id varchar(40) DEFAULT (uuid()) NOT NULL PRIMARY KEY,
      name varchar(30),
      email varchar(30),
      password varchar(60),
      role varchar(30) DEFAULT 'user'
    );`;
  await connection.query(query);

  const [userRows] = await connection.query("SELECT * FROM USER");

  if (userRows.length == 0) {
    const insertUsers = `INSERT INTO USER (name, email, password, role) values ?`;
    await connection.query(insertUsers, [users]);
  }
}

initDB().then(() => {
  console.log("DB initiated.");
  process.exit();
});