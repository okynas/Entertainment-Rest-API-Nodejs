
const crypto = require("crypto");
const { Op } = require("sequelize");

const {authentication, userExist, alreadyLoggedIn, createAccessToken, findUser, checkRole} = require("../middleware")

const express = require("express");
const router = express.Router();

const sequelize = require("../../db/db.config");
const jwt = require("jsonwebtoken");

const User = sequelize.User;

router.get("/", authentication, async (req, res, next) => {
  const username = jwt.verify(req.session.token, process.env.TOKEN_SECRET).username;
  const {roleId, roleName} = await checkRole(username);

  var allUsers = undefined;
  var message = "Getting your user";

  if (roleId >= 3) {
    allUsers = await User.findAll({
      attributes: {exclude: ["password"]}
    });
    message = "Showing all users";
  }

  return res.json({
    role: roleId,
    title: roleName,
    name: username,
    message: message,
    allUsers: allUsers
  })
});

// ####################################
// Authenticated Route / Private route
// ####################################
router.get("/private", authentication, async (req, res, next) => {

  const fullUser = await User.findAll({
    where: {
      username: "okynas"
    },
    attributes: {
      exclude: ["password"]
    },
    include: ["role"]
  })

  return res.status(200).json({
    status: 200,
    message: "You have come to the private route 🙊",
    token: req.session.token,
    user: fullUser[0]
  })
})

// ####################################
// Login
// ####################################
router.post("/login", userExist, alreadyLoggedIn, async (req, res, next) => {
  
  const userToCheck = await findUser(req.body.username, req.body.email, req.body.password);

  const token = createAccessToken(userToCheck["username"]); 

  req.session.token = token;

  return res.status(200)
  .json({
    status: 200,
    user: userToCheck,
    token: token
  })


});

// ####################################
// Signup
// ####################################
router.post("/signup", async (req, res, next) => {

  const password = crypto.pbkdf2Sync(req.body.password, "salt", 100000, 102, "sha512")

  const existingUser = await User.findAll({
    where: {
      [Op.or] : [
        {username: req.body.username},
        {email: req.body.email}
      ]
    }
  })

  if (existingUser.length > 0) {
    return res.status(401).json({
      status: 401,
      status_type: "Unauthorized",
      message: "User already exist",
    })
  }

  const createdUser = await User.create({
    "username": req.body.username,
    "email": req.body.email,
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "gender": req.body.gender,
    "password": password.toString("hex"),
    "status": 1,
    "createdAt": Date.now(),
    "updatedAt": Date.now(),
    "roleId": 1
  })

  res.json({
    createdUser
  })

});

// ####################################
// Logout
// ####################################
router.post("/logout", (req, res, next) => {
  if (req.session.token) {
    req.session.token = undefined;
    return res.status(201).json({
      status: 201,
      message: "Logged out successfully"
    })
  }
  return res.status(400).json({
    status: 400,
    message: "Logging out failed!"
  })

})

module.exports = router;