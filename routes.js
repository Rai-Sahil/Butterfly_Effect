const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const { dbName, connectionParams } = require("./constants");

async function authenticate(email, password, callback) {
  const connection = await mysql.createConnection({
    ...connectionParams,
    database: dbName
  })

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

router.get("/", function (req, res) {
  if (req.session.loggedIn) {
    res.sendFile("index.html", { root: __dirname + "/public/html" });
  } else {
    res.redirect("/login");
  }
});

router.get("/login", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.sendFile("login.html", { root: __dirname + "/public/html" });
  }
});

router.get("/signup", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.sendFile("signup.html", { root: __dirname + "/public/html" });
  }
});

router.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const { email, password } = req.body;

  return authenticate(email, password, function (user) {
    if (user == null) {
      res.status(401).send({ message: "User authentication failed." });
    } else {
      const { name, email } = user;
      req.session.loggedIn = true;
      req.session.email = email;
      req.session.name = name;
      req.session.save((error) => error && console.error("Unable to save session:", error));
      res.status(200).send({ message: "User authentication succeeded.", user });
    }
  });
});

router.post("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Log out attempt failed.");
      } else {
        res.redirect("/login");
      }
    });
  }
});

router.use(function (req, res, next) {
  res.status(404).send("There is nothing here, 404.");
});

module.exports = router;