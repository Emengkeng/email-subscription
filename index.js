require("dotenv").config()
var express = require('express');
var app = express();
const path = require('path');
//Body parser used to parse the request body
var bodyParser = require('body-parser');
var knex = require('./db/db');
var subscribe = require('./subscribe');
var cors = require("cors")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors)

app.use('/subscribe',subscribe);

app.get('/', function (req, res) {
  res.send('<a href="https://www.exhert.com">https://www.exhert.com</a>');
});

app.listen(process.env.PORT || 5000, function () {
  console.log('Portfolio backend listening on port 5000!');
});