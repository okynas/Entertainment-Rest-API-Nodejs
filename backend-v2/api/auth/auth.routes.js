const crypto = require("crypto");
const { Op } = require("sequelize");
const {authentication, userExist, alreadyLoggedIn, createAccessToken, findUser, isStaff, findUserAndLogIn} = require("../middleware")
const express = require("express");
const router = express.Router();
const sequelize = require("../../db/db.config");
const jwt = require("jsonwebtoken");
const User = sequelize.User;
const Role = sequelize.Role;


router.get("/", authentication, async (req, res, next) => {
  const username = jwt.verify(req.session.token, process.env.TOKEN_SECRET).username;
  const staff = await isStaff(username);

  var allUsers = undefined;
  var message = "Getting your user";

  if (staff) {
    allUsers = await User.findAll();
    message = "Showing all users";
  }

  allUsers = await findUser(username)

  return res.json({
    message: message,
    allUsers
  })
});

// ####################################
// Getting Roles
// ####################################

router.get("/roles", async (req, res, next) => {
  const allRoles = await Role.findAll();
  return res.json({
    roles: allRoles
  })
});

// ####################################
// Authenticated Route / Private route
// ####################################
router.get("/private", (req, res, next) => {

  return res.json(req.session)

  // const fullUser = await User.findAll({
  //   where: {
  //     username: "okynas"
  //   },
  //   attributes: {
  //     exclude: ["password"]
  //   },
  //   include: ["role"]
  // })

  // return res.status(200).json({
  //   status: 200,
  //   message: "You have come to the private route 🙊",
  //   token: req.session.token,
  //   user: fullUser[0]
  // })
})

// ####################################
// Login
// ####################################
router.post("/login", userExist, alreadyLoggedIn, async (req, res, next) => {
  
  const userToCheck = await findUserAndLogIn(req.body.username, req.body.email, req.body.password);
  const token = createAccessToken(userToCheck); 

  req.session.token = token;

  return res.status(200)
    .json({
      status: 200,
      user: userToCheck,
      token: token
    });
});

// ####################################
// Signup
// ####################################
router.post("/signup", async (req, res, next) => {
  const existingUser = await findUser(req.body.username)

  if (existingUser) {
    return res.status(401).json({
      status: 401,
      status_type: "Unauthorized",
      message: "User already exist",
    })
  }

  const password = crypto.pbkdf2Sync(req.body.password, "salt", 100000, 102, "sha512")
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