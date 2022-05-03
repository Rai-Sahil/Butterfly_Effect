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

module.exports = {
    authenticate
}