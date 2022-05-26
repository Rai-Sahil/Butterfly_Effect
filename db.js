"use strict";

const { connectionParams, dbUserTable, saltRounds } = require("./constants");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

const connection = mysql.createConnection(connectionParams).promise();

async function authenticate(email, password, callback) {
  try {
    const query = `SELECT uuid, name, email, password FROM ${dbUserTable} WHERE email = ? LIMIT 1;`;

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
    return callback({ status: 500, message: "Internal server error." });
  }
}

async function createUser(name, email, password, callback) {
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
    if (await isEmailInUse(email)) {
      return callback({ status: 409, message: "Email already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertUserQuery = `INSERT INTO ${dbUserTable} (name, email, password) values (?, ?, ?)`;
    await connection.query(insertUserQuery, [name, email, hashedPassword]);
    const getUserByEmailQuery = `SELECT * FROM ${dbUserTable} WHERE email = ? LIMIT 1;`;
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
  try {
    const getUserByIdQuery = `SELECT uuid, name, email, role FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
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
  try {
    const deleteUserQuery = `DELETE FROM ${dbUserTable} WHERE uuid = ? LIMIT 1`;
    await connection.query(deleteUserQuery, [uuid]);
    return callback({ status: 200, message: "Successfully deleted user." });
  } catch (error) {
    console.error("Error getting users: ", error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

async function isEmailInUse(email, uuid) {
  const getUserByEmailQuery = `SELECT * FROM ${dbUserTable} WHERE email = ? LIMIT 1;`;
  const [existingUsers] = await connection.query(getUserByEmailQuery, [email]);
  if (!uuid) {
    return existingUsers.length === 1;
  }
  return existingUsers.length === 1 && uuid !== existingUsers[0].uuid;
}

async function editUser(uuid, attribute, value, callback) {
  try {
    if (attribute == "email" && (await isEmailInUse(value, uuid))) {
      return callback({ status: 409, message: "Email already in use." });
    }
    const editUserQuery = `UPDATE ${dbUserTable} SET ${attribute} = ? WHERE uuid = ? LIMIT 1;`;
    if (attribute == "password") {
      value = await bcrypt.hash(value, saltRounds);
    }
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
  try {
    const getUsersQuery = `SELECT name, email, role, uuid FROM ${dbUserTable};`;
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

async function isAdmin(uuid) {
  try {
    const getUserByIdQuery = `SELECT uuid, name, email, role FROM ${dbUserTable} WHERE uuid = ? AND role = 'admin' LIMIT 1;`;
    const [users] = await connection.query(getUserByIdQuery, [uuid]);
    return users.length === 1;
  } catch (error) {
    console.error("Error getting user: ", error);
    return false;
  }
}

module.exports = {
  connection,
  authenticate,
  createUser,
  deleteUser,
  editUser,
  getUserByUUID,
  getUsers,
  isAdmin,
};
