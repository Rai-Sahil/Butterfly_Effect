const express = require("express");
const router = express.Router();

// name | email | password
const users = [
  ["Daniel Shen", "danielshen@bby32.com", "danielshen"],
  ["Delson Tan", "delsontan@bby32.com", "delsontan"],
  ["Navdeep Litt", "navdeeplitt@bby32.com", "navdeeplitt"],
  ["Sahil Rai", "sahilrai@bby32.com", "sahilrai"]
]

// @TODO connect to DB and check against users table
async function authenticate(email, password, callback) {
  const user = users.find((user) => user[1] == email);
  if (!user || (user && password != user[2])) {
    return callback(null);
  } else {
    return callback(user);
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