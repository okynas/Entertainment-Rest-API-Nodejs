const jwt = require("jsonwebtoken");
const crypto = require("crypto");

require('dotenv').config();

const sequelize = require("../db/db.config");
const User = sequelize.User;
const Role = sequelize.Role;
const { Op } = require("sequelize");

module.exports.createAccessToken = function (username) {
  return jwt.sign({username: username}, process.env.TOKEN_SECRET, {expiresIn: "1h"});
}

module.exports.authentication = function(req, res, next) {
  if (req.session.token) {
    return next();
  }

  return res.status(401).json({
    status: 401,
    message: "Unauthorized"
  })
}

module.exports.alreadyLoggedIn = async function(req, res, next) {
  if (req.session.token) {
    return res.status(200).json({
      status: 200,
      user: jwt.verify(req.session.token, process.env.TOKEN_SECRET).username,
      message: "Already logged in"
    })
  }
  else {
    next();
  }
}

module.exports.isStaff = async function(req, res, next) {

  try {
    const userToCheck = await User.findOne({
      where: {username: jwt.verify(req.session.token, process.env.TOKEN_SECRET).username},
      include: ["role"]
    })

    const rolleId = userToCheck["role"]["id"];

    if (rolleId >= 2) {
      return next();
    }

    throw "Unauthorized"

  }
  catch(err) {
    return res.status(401).json({
      status: 401,
      error: String(err)
    })
  }


}

module.exports.userExist = async function(req, res, next) {

  try {
    const key = crypto.pbkdf2Sync(req.body.password, "salt", 100000, 102, "sha512");
    const userToCheck = await User.findOne({
      where: {
        [Op.and] : [
          {username: req.body.username},
          {email: req.body.email},
          {password: key.toString("hex")},
        ]
      }
    });

    if (userToCheck) {
      return next();
    }

    throw "User not found";
  }

  catch(err) {
    return res.status(404).json({
      status: 404,
      error: err
    })
  }

}

module.exports.findUser = async function(username) {

  try {
    const userToCheck = await User.findOne({
      where: { username: username },
      attributes: { exclude: ["password"] },
      include: ["role"]
    });

    if (userToCheck) return userToCheck;

    throw "User does not exist"
  }

  catch(err) {
    return null;
  }


}

module.exports.findUserAndLogIn = async function(username, email, password) {
  const key = crypto.pbkdf2Sync(password, "salt", 100000, 102, "sha512")

  const userToCheck = await User.findOne({
    where: {
      [Op.and] : [
        {username: username},
        {email: email},
        {password: key.toString("hex")},
      ],
    },
    attributes: {
      exclude: ["password"]
    }
  })

  return userToCheck.username;
}

module.exports.checkUserRole = async function(currentUser, userToDelete) {

  const thisUser = await User.findOne({
    where: {username: currentUser},
    include: ["role"],
  });

  const roleOfCurrentUser = thisUser["role"]["level"]; // => 3 if admin

  const {name, level} = await Role.findOne({
    where: {name: userToDelete},
    attributes: ['name', 'level']
  });

  if (roleOfCurrentUser >= level) {
    return roleOfCurrentUser;
  } else {
    return null;
  }

}

module.exports.capitalizeFirst = function(string) {
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1);
}