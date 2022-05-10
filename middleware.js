"use strict";

const { getUserByUUID } = require("./db");

async function requireAdmin(req, res, next) {
  const { uuid } = req.session;
  if (!uuid) {
    res.status(404).send("No user found.");
  }
  await getUserByUUID(uuid, ({ status, message, user }) => {
    if (status !== 200) {
      return res.status(status).send({ message });
    }
    if (user.role != "admin") {
      return res.status(403).send({ message: "User is not admin." });
    }
    next();
  });
}

async function requireLoggedOut(req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    next();
  }
}

async function requireLoggedIn(req, res, next) {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    next();
  }
}

module.exports = {
  requireAdmin,
  requireLoggedIn,
  requireLoggedOut,
};
