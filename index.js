const fs = require("fs");
const express = require('express');
const session = require("express-session");

const app = express();
const port = 8000;

app.use(express.static(__dirname + "/public"));
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

app.get("/", function (req, res) {
  if (req.session.loggedIn) {
    res.sendFile("index.html", { root: __dirname + "/public/html" });
  } else {
    res.redirect("/login");
  }
});

app.get("/login", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.sendFile("login.html", { root: __dirname + "/public/html" });
  }
});

app.get('/data/newsfeed', function (req, res) {
    let doc = fs.readFileSync('./app/models/newsfeed.xml', "utf8");
    res.send(doc);
});

app.use(function (req, res, next) {
  res.status(404).send("Nothing there, 404.");
})

app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
