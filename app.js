const express = require('express');
const session = require("express-session");
const { port } = require("./constants");

const app = express();

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

app.use(require('./routes'));

app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
