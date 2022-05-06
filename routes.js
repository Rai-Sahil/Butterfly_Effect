const express = require("express");
const router = express.Router();
const { authenticate, createUser, getUsers } = require("./db");
const {
  requireAdmin,
  requireLoggedIn,
  requireLoggedOut,
} = require("./middleware");

router.get("/", requireLoggedIn, function (_, res) {
  res.sendFile("index.html", { root: __dirname + "/public/html" });
});

router.get("/signup", requireLoggedOut, function (req, res) {
  res.sendFile("signup.html", { root: __dirname + "/public/html" });
});

router.post("/signup", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const { name, email, password } = req.body;

  return createUser(name, email, password, ({ status, message, user }) => {
    if (status !== 200) {
      res.status(status).send({ message });
    } else {
      req.session.loggedIn = true;
      req.session.userId = user.id;
      req.session.save(
        (error) => error && console.error("Unable to save session:", error)
      );
      res.status(status).send({ message, user });
    }
  });
});

router.get("/login", requireLoggedOut, function (req, res) {
  res.sendFile("login.html", { root: __dirname + "/public/html" });
});

router.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const { email, password } = req.body;

  return authenticate(email, password, function (user) {
    if (user == null) {
      res.status(401).send({ message: "User authentication failed." });
    } else {
      req.session.loggedIn = true;
      req.session.userId = user.id;
      req.session.save(
        (error) => error && console.error("Unable to save session:", error)
      );
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

router.get("/game", requireLoggedIn, function (req, res) {
  res.sendFile("game-card.html", { root: __dirname + "/public/html" });
});

router.get("/timeline", requireLoggedIn, function (req, res) {
  res.sendFile("timeline.html", { root: __dirname + "/public/html" });
});

router.get("/users", requireLoggedIn, requireAdmin, function (_, res) {
  getUsers(({ status, message, users }) => {
    if (status !== 200) {
      res.status(status).send({ message });
    } else {
      res.status(status).send({ message, users });
    }
  });
});

router.use(function (_, res) {
  res.status(404).send("There is nothing here, 404.");
});

module.exports = router;
