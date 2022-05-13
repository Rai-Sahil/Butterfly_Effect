"use strict";

const express = require("express");
const router = express.Router();
const {
  authenticate,
  getUserByUUID,
  createUser,
  deleteUser,
  editUser,
  getUsers,
} = require("./db");
const {
  requireAdmin,
  requireCurrentUser,
  requireLoggedIn,
  requireLoggedOut,
} = require("./middleware");
const {
  uploadAvatarImage,
  getAvatarPathByUUID,
} = require("./upload-avatar-images");

router.get("/", requireLoggedIn, function (_, res) {
  res.sendFile("index.html", {
    root: __dirname + "/public/html",
  });
});

router.get("/signup", requireLoggedOut, function (req, res) {
  res.sendFile("signup.html", {
    root: __dirname + "/public/html",
  });
});

router.post("/signup", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const { name, email, password } = req.body;

  return createUser(name, email, password, ({ status, message, user }) => {
    if (status !== 200) {
      res.status(status).send({
        message,
      });
    } else {
      req.session.loggedIn = true;
      req.session.uuid = user.uuid;
      req.session.save(
        (error) => error && console.error("Unable to save session:", error)
      );
      res.status(status).send({
        message,
        user,
      });
    }
  });
});

router.get("/login", requireLoggedOut, function (req, res) {
  res.sendFile("login.html", {
    root: __dirname + "/public/html",
  });
});

router.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const { email, password } = req.body;

  return authenticate(email, password, function (user) {
    if (user == null) {
      res.status(401).send({
        message: "Incorrect email or password.",
      });
    } else {
      req.session.loggedIn = true;
      req.session.uuid = user.uuid;
      req.session.save(
        (error) => error && console.error("Unable to save session:", error)
      );
      res.status(200).send({
        message: "User authentication succeeded.",
        user,
      });
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
  res.sendFile("game-card.html", {
    root: __dirname + "/public/html",
  });
});

router.get("/timeline", requireLoggedIn, function (req, res) {
  res.sendFile("timeline.html", {
    root: __dirname + "/public/html",
  });
});

router.get("/contactus", requireLoggedIn, function (req, res) {
  res.sendFile("contactus.html", {
    root: __dirname + "/public/html",
  });
});

router.get("/profile", requireLoggedIn, function (req, res) {
  res.sendFile("profile.html", {
    root: __dirname + "/public/html",
  });
});

router.get("/users", requireLoggedIn, requireAdmin, function (_, res) {
  return getUsers(({ status, message, users }) => {
    if (status !== 200) {
      res.status(status).send({
        message,
      });
    } else {
      res.status(status).send({
        message,
        users,
      });
    }
  });
});

router.get(
  "/users/:id",
  requireLoggedIn,
  requireCurrentUser,
  function (req, res) {
    const uuid = req.params.id;
    return getUserByUUID(uuid, ({ status, message, user }) => {
      if (status !== 200) {
        res.status(status).send({ message });
      } else {
        res.status(status).send({ message, user });
      }
    });
  }
);

router.post("/users", requireLoggedIn, requireAdmin, function (req, res) {
  const { name, email, password } = req.body;
  return createUser(name, email, password, ({ status, message }) => {
    res.status(status).send({ message });
  });
});

router.put(
  "/users/:id",
  requireLoggedIn,
  requireCurrentUser,
  function (req, res) {
    const userId = req.params.id;
    const { name, password, email, role } = req.body;
    let attribute, value;
    // only edit one attribute per request
    if (name != undefined) {
      attribute = "name";
      value = name;
    } else if (password != undefined) {
      attribute = "password";
      value = password;
    } else if (email != undefined) {
      attribute = "email";
      value = email;
    } else if (role != undefined) {
      attribute = "role";
      value = role;
    } else {
      res
        .status(400)
        .send({ message: "No params provided, nothing to change." });
    }

    return editUser(userId, attribute, value, ({ status, message }) => {
      res.status(status).send({ message });
    });
  }
);

router.delete("/users/:id", requireLoggedIn, requireAdmin, function (req, res) {
  const userId = req.params.id;
  deleteUser(userId, ({ status, message }) => {
    res.status(status).send({
      message,
    });
  });
});

router.get("/upload-test", requireLoggedIn, function (req, res) {
  res.sendFile("upload-test.html", {
    root: __dirname + "/public/html",
  });
});

router.get("/avatar-image", requireLoggedIn, function (req, res) {
  const { uuid } = req.session;
  const avatarPath = getAvatarPathByUUID(uuid);
  if (!avatarPath) {
    res.status(404).send("No avatar image found.");
  }
  res.status(200).sendFile(avatarPath);
});

router.post(
  "/upload-avatar-image",
  uploadAvatarImage.array("files"),
  function (req, res) {
    console.info(req.files);
    res.status(200).send("POST upload avatar image success");
  }
);

router.use(function (_, res) {
  res.status(404).sendFile("404.html", {
    root: __dirname + "/public/html",
  });
});

module.exports = router;