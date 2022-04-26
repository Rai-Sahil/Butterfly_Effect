const fs = require("fs");
const express = require('express');
const session = require("express-session");

const app = express();
const port = 8000;

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// name | email | password
const users = [
  ["Daniel Shen", "danielshen@bby32.com", "danielshen"],
  ["Delson Tan", "delsontan@bby32.com", "delsontan"],
  ["Navdeep Litt", "navdeeplitt@bby32.com", "navdeeplitt"],
  ["Sahil Rai", "sahilrai@bby32.com", "sahilrai"]
]

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

app.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const { email, password } = req.body;

  console.log("Email: ", email);
  console.log("Password: ", password);

  return authenticate(email, password, function (user) {
    if (user == null) {
      res.status(401).send({message: "User authentication failed."});
    } else {
      const {name, email} = user;
      req.session.loggedIn = true;
      req.session.email = email;
      req.session.name = name;
      req.session.save((error) => {
        console.error(error);
      });
      res.status(200).send({message: "User authentication succeeded.", user});
    }
  });
});

app.post("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Log out attempt failed.");
      } else {
        res.redirect("/login");
      }
    })
  }
})

app.use(function (req, res, next) {
  res.status(404).send("There is nothing here, 404.");
})

// @TODO connect to DB and check against users table
async function authenticate(email, password, callback) {
  const user = users.find((user) => user[1] == email);
  if (user) {
    if (user && password == user[2]) {
      return callback(user);
    } else {
      return callback(null);
    }
  }
}

app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
