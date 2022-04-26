const fs = require("fs");
const express = require('express');

const app = express();

app.use('/js', express.static('./public/js'));
app.use('/css', express.static('./public/css'));
app.use('/img', express.static('./public/img'));

app.get('/', function (req, res) {
    let doc = fs.readFileSync('./public/html/index.html', "utf8");
    res.send(doc);
});

app.get('/data/newsfeed', function (req, res) {
    let doc = fs.readFileSync('./app/models/newsfeed.xml', "utf8");
    res.send(doc);
});

app.use(function (req, res, next) {
  res.status(404).send("Nothing there, 404.");
})

const port = 8000;
app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
