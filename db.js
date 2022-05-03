const mysql = require("mysql2/promise");
const { dbName, connectionParams } = require("./constants");

async function authenticate(email, password, callback) {
  const connection = await mysql.createConnection({
    ...connectionParams,
    database: dbName,
  });

  const query = "SELECT * FROM USERS WHERE email = ? AND password = ? LIMIT 1;";

  try {
    const [rows] = await connection.query(query, [email, password]);
    if (rows.length == 1) {
      return callback(rows[0]);
    } else {
      return callback(null);
    }
  } catch (error) {
    console.error("Error authenticating: ", error);
  }
}

async function createUser(name, email, password, callback) {
  const connection = await mysql.createConnection({
    ...connectionParams,
    database: dbName,
  });

  const checkEmailQuery = "SELECT * FROM USERS WHERE email = ? LIMIT 1;";

  const insertUserQuery = "INSERT INTO USERS (name, email, password) values (?, ?, ?)";

  try {
      const [rows] = await connection.query(checkEmailQuery, [email]);
      if (rows.length == 1) {
          return callback({status: 409, message: "Email already in use."});
      }
      await connection.query(insertUserQuery, [name, email, password]);
      callback({status: 200, message: "User successfully created."});
  } catch (error) {
      console.error("Error creating user: ", error);
      callback({status: 500, message: "Internal server error."});
  }
  
}

module.exports = {
  authenticate,
  createUser
};
