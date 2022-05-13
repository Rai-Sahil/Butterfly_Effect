"use strict";

const mysql = require("mysql2/promise");
const { dbUserTable, connectionParams, saltRounds } = require("./constants");
const bcrypt = require("bcrypt");

async function authenticate(email, password, callback) {
  const connection = await mysql.createConnection(connectionParams);
  const query = `SELECT uuid, name, email, password FROM ${dbUserTable} WHERE email = ? LIMIT 1;`;

  try {
    const [[user]] = await connection.query(query, [email]);
    if (!user) {
      return callback(null);
    } else {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        return callback({
          name: user.name,
          email: user.email,
          uuid: user.uuid,
        });
      } else {
        return callback(null);
      }
    }
  } catch (error) {
    console.error("Error authenticating: ", error);
  }
}

async function createUser(name, email, password, callback) {
  const connection = await mysql.createConnection(connectionParams);

  try {
    if (!name) {
      return callback({
        status: 400,
        message: "Cannot sign up without a name.",
      });
    }
    if (!email) {
      return callback({
        status: 400,
        message: "Cannot sign up without an email.",
      });
    }
    if (!password) {
      return callback({
        status: 400,
        message: "Cannot sign up without a password.",
      });
    }
    const getUserByEmailQuery = `SELECT * FROM ${dbUserTable} WHERE email = ? LIMIT 1;`;
    const insertUserQuery = `INSERT INTO ${dbUserTable} (name, email, password) values (?, ?, ?)`;
    const [existingUsers] = await connection.query(getUserByEmailQuery, [
      email,
    ]);
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

async function getUserByUUID(uuid, callback) {
  const connection = await mysql.createConnection(connectionParams);

  const getUserByIdQuery = `SELECT uuid, name, email, role FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
  try {
    const [[user]] = await connection.query(getUserByIdQuery, uuid);
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

async function deleteUser(uuid, callback) {
  const connection = await mysql.createConnection(connectionParams);
  const deleteUserQuery = `DELETE FROM ${dbUserTable} WHERE uuid = ? LIMIT 1`;
  try {
    await connection.query(deleteUserQuery, [uuid]);
    return callback({ status: 200, message: "Successfully deleted user." });
  } catch (error) {
    console.error("Error getting users: ", error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

async function isEmailInUse(email, uuid, connection) {
  const getUserByEmailQuery = `SELECT * FROM ${dbUserTable} WHERE email = ? LIMIT 1;`;
  const [existingUsers] = await connection.query(getUserByEmailQuery, [email]);
  return existingUsers.length === 1 && uuid !== existingUsers[0].uuid;
}

async function editUser(uuid, attribute, value, callback) {
  const connection = await mysql.createConnection(connectionParams);
  if (attribute == "email" && await isEmailInUse(value, uuid, connection)) {
    return callback({ status: 409, message: "Email already in use." });
  }
  const editUserQuery = `UPDATE ${dbUserTable} SET ${attribute} = ? WHERE uuid = ? LIMIT 1;`;
  if (attribute == "password") {
    value = await bcrypt.hash(value, saltRounds);
  }
  try {
    await connection.query(editUserQuery, [value, uuid]);
    return callback({
      status: 200,
      message: `Successfully updated ${attribute}.`,
    });
  } catch (error) {
    console.error("Error getting users: ", error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

async function getUsers(callback) {
  const connection = await mysql.createConnection(connectionParams);

  const getUsersQuery = `SELECT name, email, role FROM ${dbUserTable};`;
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
  deleteUser,
  editUser,
  getUserByUUID,
  getUsers,
};
