const mysql = require("mysql2/promise");
require("dotenv").config();

const dbName = "bby32";

// name | email | password
const users = [
  ["Daniel Shen", "danielshen@bby32.com", "danielshen"],
  ["Delson Tan", "delsontan@bby32.com", "delsontan"],
  ["Navdeep Litt", "navdeeplitt@bby32.com", "navdeeplitt"],
  ["Sahil Rai", "sahilrai@bby32.com", "sahilrai"]
]


async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  /**
   * Create specified database if it does not exist, uses it.
   * Then, creates user table if it does not exist.
   */
  const query = `
    CREATE DATABASE IF NOT EXISTS ${dbName};
    use ${dbName};
    CREATE TABLE IF NOT EXISTS users (
      ID int NOT NULL AUTO_INCREMENT,
      name varchar(30),
      email varchar(30),
      password varchar(30),
      PRIMARY KEY (ID)
    );`;
  await connection.query(query);

  const [userRows] = await connection.query("SELECT * FROM users");

  if (userRows.length == 0) {
    const insertUsers = `INSERT INTO users (name, email, password) values ?`;
    await connection.query(insertUsers, [users]);
  }
}

initDB().then(()=> {
    console.log("DB initiated.");
    process.exit();
});