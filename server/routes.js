"use strict";

const path = require("path");
const express = require("express");
const router = express.Router();
const {
  authenticate,
  getUserByUUID,
  createUser,
  deleteUser,
  editUser,
  getUsers,
  isAdmin,
} = require("./db");
const {
  getQuestions,
  getChoices,
  getChoiceByID,
  updateQuestion,
  updateChoice,
  deleteQuestion,
  getPlaythrough,
  startPlaythrough,
  savePlaythroughProgress,
  getPlaythroughQuestions,
  saveEnding,
  getLatestEndings,
  endingsEarned,
} = require("./game-db");
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
    root: path.join(__dirname, "../public/html"),
  });
});

router.get("/signup", requireLoggedOut, function (req, res) {
  res.sendFile("login.html", {
    root: path.join(__dirname, "../public/html"),
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
    root: path.join(__dirname, "../public/html"),
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
    root: path.join(__dirname, "../public/html"),
  });
});

router.get("/timeline", requireLoggedIn, function (req, res) {
  res.sendFile("timeline.html", {
    root: path.join(__dirname, "../public/html"),
  });
});

router.get("/contact-us", requireLoggedIn, function (req, res) {
  res.sendFile("contact-us.html", {
    root: path.join(__dirname, "../public/html"),
  });
});

router.get("/profile", requireLoggedIn, function (req, res) {
  res.sendFile("profile.html", {
    root: path.join(__dirname, "../public/html"),
  });
});

router.get("/rules", requireLoggedIn, function (req, res) {
  res.sendFile("How_To_Play.html", {
    root: path.join(__dirname, "../public/html"),
  });
});

router.get("/about-us", requireLoggedIn, function (req, res) {
  res.sendFile("about-us.html", {
    root: path.join(__dirname, "../public/html"),
  });
});

router.get("/ending-collection", requireLoggedIn, function (req, res) {
  res.sendFile("ending-collection.html", {
    root: path.join(__dirname, "../public/html"),
  });
});

router.get("/ending-details", requireLoggedIn, function (req, res) {
  res.sendFile("ending-details.html", {
    root: path.join(__dirname, "../public/html"),
  });
});

router.get(
  "/admin-dashboard",
  requireLoggedIn,
  requireAdmin,
  function (req, res) {
    res.sendFile("admin-dashboard.html", {
      root: path.join(__dirname, "../public/html"),
    });
  }
);

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

router.get("/avatar-image", requireLoggedIn, function (req, res) {
  const { uuid } = req.session;
  const avatarPath = getAvatarPathByUUID(uuid);
  if (avatarPath == null) {
    return res.status(404).send("No avatar image found.");
  }
  return res.status(200).sendFile(avatarPath);
});

router.post(
  "/upload-avatar-image",
  uploadAvatarImage.array("files"),
  function (req, res) {
    res.status(200).send("POST upload avatar image success");
  }
);

//Check admin
router.get("/checkadmin", requireLoggedIn, async function (req, res) {
  res.send(await isAdmin(req.session.uuid));
});

//game-db
router.get(
  "/question-edit",
  requireLoggedIn,
  requireAdmin,
  function (req, res) {
    res.sendFile("question-edit.html", { root: __dirname + "/public/html" });
  }
);

router.get("/questions", requireLoggedIn, function (req, res) {
  getQuestions(res);
});

router.post("/questions", requireLoggedIn, requireAdmin, function (req, res) {
  res.setHeader("Content-Type", "application/json");
  var { question, qid } = req.body;
  updateQuestion(question, qid, ({ status, message }) => {
    res.status(status).send({ message });
  });
});

router.get("/choices", requireLoggedIn, function (req, res) {
  var qid = req.query["qid"];
  getChoices(qid, res);
});

router.get("/choice-by-id", requireLoggedIn, function (req, res) {
  var choice_id = req.query["cid"];
  getChoiceByID(choice_id, res);
});

router.post("/choices", requireLoggedIn, requireAdmin, function (req, res) {
  res.setHeader("Content-Type", "application/json");
  var { questionID, optionID, text, envi, comf } = req.body;
  updateChoice(
    questionID,
    optionID,
    text,
    envi,
    comf,
    ({ status, message }) => {
      res.status(status).send({ message });
    }
  );
});

router.delete("/question", requireLoggedIn, requireAdmin, function (req, res) {
  var qid = req.query["qid"];
  var oid = req.query["oid"];
  deleteQuestion(qid, oid, res);
});

// Get current playthrough
router.get("/playthrough", requireLoggedIn, function (req, res) {
  const { uuid } = req.session;
  return getPlaythrough(uuid, ({ status, message, playthrough }) => {
    if (status !== 200) {
      return res.status(status).send({ message });
    }
    return res.status(status).send({ message, playthrough });
  });
});

// Starts a new playthrough
router.post("/playthrough", requireLoggedIn, function (req, res) {
  const { uuid } = req.session;
  return startPlaythrough(
    uuid,
    ({ status, message, playthroughId, questionId }) => {
      if (status !== 200) {
        return res.status(status).send({ message });
      }
      return res.status(status).send({ message, playthroughId, questionId });
    }
  );
});

// Update db to save user choice and advance to next question
router.put("/playthrough", requireLoggedIn, function (req, res) {
  const { playthroughId, questionId, choiceId } = req.body;
  return savePlaythroughProgress(
    playthroughId,
    questionId,
    choiceId,
    ({ status, message }) => {
      return res.status(status).send({ message });
    }
  );
});

// Get playthrough and playthrough questions
router.get("/playthrough/questions", requireLoggedIn, function (req, res) {
  const { uuid } = req.session;
  const { playthroughId } = req.query;
  return getPlaythroughQuestions(
    uuid,
    playthroughId,
    ({ status, message, playthrough, questions }) => {
      if (status !== 200) {
        return res.status(status).send({ message });
      }
      return res.status(status).send({ message, playthrough, questions });
    }
  );
});

router.get("/ending/:id", requireLoggedIn, function (req, res) {
  const uuid = req.params.id;
  return getLatestEndings(uuid, ({ status, message, endings }) => {
    if (status === 200) {
      return res.status(status).send({ message, endings });
    } else {
      return res.status(status).send({ message });
    }
  });
});

router.get("/ending", requireLoggedIn, function (req, res) {
  res.sendFile("ending.html", {
    root: path.join(__dirname, "../public/html"),
  });
});

router.post("/ending", function (req, res) {
  const { uuid } = req.session;
  return saveEnding(uuid, ({ status, message }) => {
    return res.status(status).send({ message });
  });
});

router.get("/endings", requireLoggedIn, function (req, res) {
  const uuid = req.session.uuid;
  return endingsEarned(uuid, ({ status, message, endings }) => {
    if (status !== 200) {
      return res.status(status).send({ message });
    }
    return res.status(status).send({ message, endings });
  });
});

router.use(function (_, res) {
  res.status(404).sendFile("404.html", {
    root: path.join(__dirname, "../public/html"),
  });
});

module.exports = router;
