const mysql = require("mysql2/promise");
const { dbName, connectionParams, saltRounds } = require("./constants");
const bcrypt = require("bcrypt");

async function authenticate(email, password, callback) {
  const connection = await mysql.createConnection({
    ...connectionParams,
    database: dbName,
  });

  const query = "SELECT * FROM USER WHERE email = ? LIMIT 1;";

  try {
    const [[user]] = await connection.query(query, [email]);
    if (!user) {
      return callback(null);
    } else {;
      const passwordsMatch = await bcrypt.compare(password, user.password)
      if (passwordsMatch) {
        return callback(user);
      } else {
        return callback(null);
      }
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

  const getUserByEmailQuery = "SELECT * FROM USER WHERE email = ? LIMIT 1;";
  const insertUserQuery =
    "INSERT INTO USER (name, email, password) values (?, ?, ?)";
  try {
    const [existingUsers] = await connection.query(getUserByEmailQuery, [email]);
    if (existingUsers.length == 1) {
      return callback({ status: 409, message: "Email already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await connection.query(insertUserQuery, [name, email, hashedPassword]);
    const [[user]] = await connection.query(getUserByEmailQuery, [email]);
    return callback({
      status: 200,
      message: "User successfully created.",
      user,
    });
  } catch (error) {
    console.error("Error creating user: ", error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

async function getUserById(userId, callback) {
  const connection = await mysql.createConnection({
    ...connectionParams,
    database: dbName,
  });

  const getUserByIdQuery = "SELECT * FROM USER WHERE id = ? LIMIT 1;";
  try {
    const [[user]] = await connection.query(getUserByIdQuery, userId);
    if (!user) {
      console.error("User not found.");
      return callback({ status: 404, message: "User not found." });
    }
    return callback({
      status: 200,
      message: "User successfully fetched.",
      user,
    });
  } catch (error) {
    console.error("Error getting user: ", error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

async function getUsers(callback) {
  const connection = await mysql.createConnection({
    ...connectionParams,
    database: dbName,
  });

  const getUsersQuery = "SELECT * FROM USER;";
  try {
    const [users] = await connection.query(getUsersQuery);
    return callback({
      status: 200,
      message: "Users successfully fetched.",
      users,
    });
  } catch (error) {
    console.error("Error getting users: ", error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

module.exports = {
  authenticate,
  createUser,
  getUserById,
  getUsers
};
