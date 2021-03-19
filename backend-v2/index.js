const express = require("express");
const app = express();
// const dotend = require("dotenv").config();

const bodyParser = require("body-parser");
const session = require("express-session")

// ####################
// DATABSE CONNECTION
// ####################

// require("./db/db.config").sequelize;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 60000 }
}))

const PORT = process.env.SERVER_PORT || 8001;

app.use("/api", require("./api"));

app.listen( PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})

