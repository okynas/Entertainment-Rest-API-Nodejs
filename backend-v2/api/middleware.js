const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sequelize = require("../db/db.config");
const User = sequelize.User;
const Role = sequelize.Role;
const { Op } = require("sequelize");

module.exports.createAccessToken = function (username) {
  return jwt.sign({username: username}, process.env.TOKEN_SECRET, {expiresIn: "1h"});
}

module.exports.authentication = function(req, res, next) {
  if (req.session.token) {
    next();
  }
  else {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized"
    })
  }
}

module.exports.alreadyLoggedIn = async function(req, res, next) {
  if (req.session.token) {
    return res.status(200).json({
      status: 200,
      user: jwt.verify(req.session.token, process.env.TOKEN_SECRET).username,
      message: "Already logged in"
    })
  }

  next();
}

module.exports.checkRole = async function(username) {

  const userToCheck = await User.findOne({
    where: {
      [Op.and] : [
        {username: username},
      ]
    },
    include: ["role"]
  })

  return {roleId: userToCheck["role"]["id"], roleName: userToCheck["role"]["name"]};
}

module.exports.userExist = async function(req, res, next) {
  const key = crypto.pbkdf2Sync(req.body.password, "salt", 100000, 102, "sha512")

  const userToCheck = await User.findOne({
    where: {
      [Op.and] : [
        {username: req.body.username},
        {email: req.body.email},
        {password: key.toString("hex")},
      ]
    }
  })

  if (userToCheck !== null) {
    next();
  }

  else {
    return res.status(404).json({
      status: 404,
      message: "User not found"
    })
  }
}

module.exports.findUser = async function(username, email, password) {
  const key = crypto.pbkdf2Sync(password, "salt", 100000, 102, "sha512")
  const userToCheck = await User.findOne({
    where: {
      [Op.and] : [
        {username: username},
        {email: email},
        {password: key.toString("hex")},
      ]
    },
    attributes: {
      exclude: ["password"]
    }
  })

  return userToCheck;
}

// module.exports.signUp = async function(username, email, first_name, last_name, gender, pwd, req, res, next) {
//   const password = crypto.pbkdf2Sync(pwd, "salt", 100000, 102, "sha512")

//   const existingUser = await User.findOne({
//     where: {
//       [Op.and] : [
//         {username: username},
//         {email: email},
//         {password: password.toString("hex")},
//       ]
//     }
//   })

//   if (existingUser) {
//     return res.status(401).json({
//       status: 401,
//       status_type: "Unauthorized",
//       message: "User already exist",
//     })
//   }

//   return null;

//   // const createdUser = User.create({
//   //   "username": username,
//   //   "email": email,
//   //   "first_name": first_name,
//   //   "last_name": last_name,
//   //   "gender": gender,
//   //   "password": password.toString("hex"),
//   //   "status": 1
//   // })

//   // return createdUser;
// }