const crypto = require("crypto");
const {authentication, userExist, alreadyLoggedIn, createAccessToken, findUser, isStaff, findUserAndLogIn, checkUserRole, capitalizeFirst} = require("../middleware")
const express = require("express");
const router = express.Router();
const sequelize = require("../../db/db.config");
const jwt = require("jsonwebtoken");
const User = sequelize.User;
const Role = sequelize.Role;


router.get("/users", authentication, isStaff, async (req, res, next) => {

  var allUsers = await User.findAll({
    attributes: { exclude: ["password"] },
    include: ["role"]
  });

  return res.status(200).json({
    status: 200,
    message: "Showing all users",
    allUsers
  })

});

//  TODO:
// router.put("/users", authentication, async (req, res, next) => {
//   const user = await User.update(
//     {
//       email: req.body.email,
//       first_name: req.body.first_name,
//       last_name: req.body.last_name,
//       gender: req.body.gender
//     },
//     {
//       where: {
//         username: req.body.username
//       }
//     }
//   );

//   return res.status(201).json({
//     status: 201,
//     message: "Successfully updated role",
//     user: req.body.username
//   });

// });

// ####################################
// Authenticated Profile
// ####################################

router.get("/profile", authentication, async (req, res, next) => {

  const loggedInUser = jwt.verify(req.session.token, process.env.TOKEN_SECRET).username;
  const fullUser = await User.findOne({
    where: { username: loggedInUser },
    attributes: { exclude: ["password"] },
    include: ["role"]
  })

  return res.status(200).json({
    status: 200,
    message: "You have come to the private route 🙊",
    user: fullUser
  })
})

// ####################################
// Login
// ####################################

router.post("/login", alreadyLoggedIn, userExist, async (req, res, next) => {

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
router.post("/signup", alreadyLoggedIn, async (req, res, next) => {
  const existingUser = await findUser(req.body.username)

  if (existingUser) {
    return res.status(403).json({
      status: 403,
      status_type: "Forbidden",
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

});

// ####################################
// Roles
// ####################################

router.get("/roles", authentication, isStaff, async (req, res, next) => {
  const allRoles = await Role.findAll();
  return res.status(200).json({
    status: 200,
    message: "Showing all roles",
    roles: allRoles
  })
});

router.get("/roles/:name", async (req, res, next) => {
  const nameToCheck = capitalizeFirst(req.params.name)
  const allRoles = await Role.findAll({where: {name: nameToCheck}});
  return res.status(200).json({
    status: 200,
    message: "Showing all roles",
    roles: allRoles
  })
});

router.post("/role", authentication, isStaff, async (req, res, next) => {

  const userRoleCheck = checkUserRole(jwt.verify(req.session.token, process.env.TOKEN_SECRET).username, req.body.role);

  if (userRoleCheck !== NaN && userRoleCheck > req.body.level) {
    const roleExist = await Role.findOne({ where: { name : req.body.role} });

    if (!roleExist) {
      await Role.create({ name: req.body.role, level: req.body.level});
      return res.status(201).json({
        status: 201,
        message: `Successfully Created Role: ${req.body.role}`,
      })
    }

    return res.status(403).json({
      status: 403,
      message: "Unable to create role, role already exist",
    })

  }

  return res.status(401).json({
    status: 401,
    message: "Not permission to create role"
  })
});

router.put("/role", authentication, isStaff, async (req, res, next) => {

  const userRoleCheck = checkUserRole(jwt.verify(req.session.token, process.env.TOKEN_SECRET).username, req.body.role);

  if (userRoleCheck !== NaN && userRoleCheck > req.body.level) {

    const roleExist = await Role.findOne({ where: { name : req.body.role} });

    if (roleExist) {
      await Role.update({ name: req.body.newName, level: req.body.newLevel }, {
        where: {
          name: req.body.role
        }
      });

      return res.status(201).json({
        status: 201,
        message: "Successfully updated role",
        role: req.body.role
      })
    }

    return res.status(403).json({
      status: 403,
      message: "Unable to update role, role does not exist",
    });


  }

  return res.status(401).json({
    status: 401,
    message: "Not permission to update role"
  })

});

router.delete("/role", authentication, isStaff, async (req, res, next) => {

  const userRoleCheck = await checkUserRole(jwt.verify(req.session.token, process.env.TOKEN_SECRET).username, req.body.role);

  if (userRoleCheck !== NaN) {

    const roleExist = await Role.findOne({ where: { name : req.body.role} });

    if (roleExist) {
      await Role.destroy({ where: {name: req.body.role} });
      return res.status(201).json({
        status: 201,
        message: `Successfully Deleted Role: ${req.body.role}`,
      })
    }

    return res.status(403).json({
      status: 403,
      message: "Unable to delete role, role does not exist",
    })

  }

  return res.status(401).json({
    status : 401,
    message: "Not Permission to delete role"
  })

});

module.exports = router;