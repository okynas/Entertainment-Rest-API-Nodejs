const express = require("express");
const app = express();
require('dotenv').config()

const bodyParser = require("body-parser");
const session = require("express-session")

// ####################
// DATABSE CONNECTION
// ####################

// require("./db/db.config").sequelize;

// app.set('trust proxy', 1)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({ 
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true, 
  cookie: { maxAge: 60000 }
}))

const PORT = process.env.SERVER_PORT || 8001;

app.use("/api", require("./api"));

app.listen( PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})

