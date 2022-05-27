"use strict";

const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "teamname.sid",
    resave: false,
    saveUninitialized: true,
    secret: "bby32",
  })
);

app.use(require("./server/routes"));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.info("App listening on port " + port + "!");
  console.info(`Visit: http://localhost:${port}/`);
});
