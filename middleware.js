"use strict";

const { getUserByUUID } = require("./db");

function requireAdmin(req, res, next) {
  const { uuid } = req.session;
  if (!uuid) {
    res.status(404).send("No user found.");
  }
  return getUserByUUID(uuid, ({ status, message, user }) => {
    if (status !== 200) {
      return res.status(status).send({ message });
    }
    if (user.role != "admin") {
      return res.status(403).send({ message: "User is not admin." });
    }
    next();
  });
}

function requireCurrentUser(req, res, next) {
  const { uuid } = req.session;
  if (!uuid) {
    return res.status(404).send("No user found.");
  }
  return getUserByUUID(uuid, ({ status, message, user }) => {
    if (status !== 200) {
      return res.status(status).send({ message });
    }
    if (user.role != "admin" && uuid != req.params.id) {
      return res.status(403).send({ message: "Cannot edit other users." });
    }
    next();
  });
}

function requireLoggedOut(req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    next();
  }
}

function requireLoggedIn(req, res, next) {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    next();
  }
}

module.exports = {
  requireAdmin,
  requireCurrentUser,
  requireLoggedIn,
  requireLoggedOut,
};
