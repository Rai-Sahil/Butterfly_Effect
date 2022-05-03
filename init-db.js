const mysql = require("mysql2/promise");
const {
  dbName,
  connectionParams
} = require("./constants");

// name | email | password | role
const users = [
  ["Delson Tan", "delsontan@bby32.com", "delsontan", "admin"],
  ["Navdeep Litt", "navdeeplitt@bby32.com", "navdeeplitt", "admin"],
  ["Sahil Rai", "sahilrai@bby32.com", "sahilrai", "admin"],
  ["Minji Kong", "minjikong@bby32.com", "minjikong", "admin"],
  ["Kemp Liao", "kempliao@bby32.com", "kempliao", "admin"],
  ["John Doe", "johndoe@bby32.com", "johndoe", "user"]
];

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
      role varchar(30) DEFAULT 'user'
      PRIMARY KEY (ID)
    );`;
  await connection.query(query);

  const [userRows] = await connection.query("SELECT * FROM USERS");

  if (userRows.length == 0) {
    const insertUsers = `INSERT INTO USERS (name, email, password, role) values ?`;
    await connection.query(insertUsers, [users]);
  }
}

initDB().then(() => {
  console.log("DB initiated.");
  process.exit();
});