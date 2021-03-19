const {authentication} = require("../middleware")

const express = require("express");
const router = express.Router();

const sequelize = require("../../db/db.config");
const jwt = require("jsonwebtoken");

const User = sequelize.User;

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    status: 200,
    message: "OK"
  })
});


router.get("/get", async (req, res, next) => {

});

module.exports = router;