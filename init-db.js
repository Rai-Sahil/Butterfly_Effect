const mysql = require("mysql2/promise");
const {
  dbName,
  connectionParams
} = require("./constants");

// name | email | password
const users = [
  ["Delson Tan", "delsontan@bby32.com", "delsontan"],
  ["Navdeep Litt", "navdeeplitt@bby32.com", "navdeeplitt"],
  ["Sahil Rai", "sahilrai@bby32.com", "sahilrai"],
  ["Minji Kong", "minjikong@bby32.com", "minjikong"],
  ["Kemp Liao", "kempliao@bby32.com", "kempliao"]
]

async function initDB() {
  const connection = await mysql.createConnection({
    ...connectionParams,
    multipleStatements: true,
  });

  const query = `
    CREATE DATABASE IF NOT EXISTS ${dbName};
    use ${dbName};
    CREATE TABLE IF NOT EXISTS USERS (
      ID int NOT NULL AUTO_INCREMENT,
      name varchar(30),
      email varchar(30),
      password varchar(30),
      PRIMARY KEY (ID)
    );`;
  await connection.query(query);

  const [userRows] = await connection.query("SELECT * FROM USERS");

  if (userRows.length == 0) {
    const insertUsers = `INSERT INTO USERS (name, email, password) values ?`;
    await connection.query(insertUsers, [users]);
  }
}

initDB().then(() => {
  console.log("DB initiated.");
  process.exit();
});