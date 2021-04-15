// const fs = require("fs");
const http = require('http');
// const https = require('https');
const express = require("express");
const session = require("express-session");
const helmet = require('helmet');
const { urlencoded, json } = require("body-parser");

const dotenv = require('dotenv').config();

// const key = {
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// };

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 8001;
// const HTTPS_PORT = process.env.HTTPS_PORT || 8443;

app.use(helmet());
app.use(urlencoded({extended: true}));
app.use(json());
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600000,
    // secure: true,
  }
}));

app.use("/api", require("./api"));

app.get("*", (req, res, next) => {
  res.status(404).json({
    status: 404,
    status_type: "Not found",
    message: "This page was not found!",
    url: req.url
  })
})

// https.createServer(key, app)
//   .listen(HTTPS_PORT, () => console.log(`Example app listening on port ${HTTPS_PORT}! Go to https://localhost:${HTTPS_PORT}/`) );

http.createServer(app)
  .listen(HTTP_PORT, () => console.log(`Example app listening on port ${HTTP_PORT}! Go to https://localhost:${HTTP_PORT}/`) );
