const crypto = require("crypto");
const {authentication, userExist, alreadyLoggedIn, createAccessToken, findUser, isStaff, findUserAndLogIn, checkUserRole, capitalizeFirst, checkPermissionToOneUser} = require("../middleware")
const express = require("express");
const router = express.Router();
const sequelize = require("../../db/db.config");
const jwt = require("jsonwebtoken");
const User = sequelize.User;
const Role = sequelize.Role;


router.get("/users", authentication, isStaff, async (req, res, next) => {

  try {
    var allUsers = await User.findAll({
      attributes: {
        exclude: ["password", 'roleId']
      },
      include: ["role"]
    });

    if (!allUsers) throw "No users to query!";

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Showing all users",
      allUsers
    });
  }

  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      error: String(err),
    });
  }



});

router.put("/users", authentication, async (req, res, next) => {
  try {
    const currentUser = jwt.verify(req.session.token, process.env.TOKEN_SECRET).username;
    const levelTwoOrHigher = await checkPermissionToOneUser(currentUser);

    const valuesToUpdate = {
      email: undefined,
      first_name: undefined,
      last_name: undefined,
      gender: undefined,
      updatedAt: Date.now(),
      roleId: undefined,
      username: undefined
    }

    if (req.body.email) valuesToUpdate.email = req.body.email;
    if (req.body.first_name) valuesToUpdate.first_name = req.body.first_name;
    if (req.body.last_name) valuesToUpdate.last_name = req.body.last_name;
    if (req.body.gender) valuesToUpdate.gender = req.body.gender;

    // if (req.body.newUsername) valuesToUpdate.username = req.body.newUsername; // Update username? Should this be possible?

    //  If your permission is 2 or higher
    if (levelTwoOrHigher && levelTwoOrHigher < req.body.roleId) throw "You cant create a user with higher permission than yourself!";
    if (levelTwoOrHigher && req.body.roleId) valuesToUpdate.roleId = req.body.roleId;
    if (!levelTwoOrHigher && req.body.roleId) throw "You do not have permission to do this!";

    await User.update(
      valuesToUpdate,
      { where: { username: req.body.username } }
    );

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Successfully updated role",
    });

  }
  catch(err) {
    return res.status(403).json({
      status: 403,
      status_type: "Forbidden",
      error: String(err)
    });
  }
});

router.delete("/users", authentication, async (req, res, next) => {
  try {
    const currentUser = jwt.verify(req.session.token, process.env.TOKEN_SECRET).username;
    const userExist = await findUser(currentUser);

    if (!userExist) throw "Unable to delete user, user does not exist!";

    await User.destroy({ where: {username: currentUser} });

    req.session.token = null;

    return res.status(201).json({
      status: 201,
      status_type: "OK",
      message: `Successfully Deleted User: ${currentUser}`,
    })
  }

  catch(err) {
    return res.status(403).json({
      status: 403,
      status_type: "Forbidden",
      error: String(err)
    });
  }
});

// ####################################
// Authenticated Profile
// ####################################

router.get("/profile", authentication, async (req, res, next) => {
  try {
    const loggedInUser = jwt.verify(req.session.token, process.env.TOKEN_SECRET).username;

    if (!loggedInUser) throw "Not logged in!";

    const fullUser = await User.findOne({
      where: { username: loggedInUser },
      attributes: { exclude: ["password", "roleId"] },
      include: ["role"]
    })

    if (!fullUser) throw "Could not find your user";

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Showing your profile 🙊",
      user: fullUser
    })
  }
  catch(err) {
    return res.status(403).json({
      status: 403,
      status_type: "Forbidden",
      error: String(err)
    });
  }
});

// ==============================>>
//              Login
// ==============================>>

router.post("/login", alreadyLoggedIn, userExist, async (req, res, next) => {
  try {

    if (!req.body.username) throw "Please provide username";
    if (!req.body.email) throw "Please provide email";
    if (!req.body.password) throw "Please provide password";

    const userToCheck = await findUserAndLogIn(req.body.username, req.body.email, req.body.password);
    const token = createAccessToken(userToCheck);

    if (!userToCheck) throw "Could not find user!";
    req.session.token = token;

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      user: userToCheck,
      token: token
    });
  }
  catch(err) {
    return res.status(403).json({
      status: 403,
      status_type: "Forbidden",
      error: String(err)
    });
  }
});

// ==============================>>
//              Signup
// ==============================>>
router.post("/signup", alreadyLoggedIn, async (req, res, next) => {

  try {
    if (!req.body.username) throw "Please provide username";
    if (!req.body.email) throw "Please provide email";
    if (!req.body.password) throw "Please provide password";

    if (!req.body.first_name) throw "Please provide firstname";
    if (!req.body.last_name) throw "Please provide lastname";
    if (!req.body.gender) throw "Please provide gender";
    const existingUser = await findUser(req.body.username)

    if (existingUser) throw "Can't create user, already exists";

    const password = crypto.pbkdf2Sync(req.body.password, process.env.PWD_HASH_SALT, Number(process.env.PWD_HASH_ITERATION), Number(process.env.PWD_HASH_LENGTH), process.env.PWD_HASH_ALGORITHM);
    const createdUser = await User.create({
      "id": Date.UTC(),
      "username": req.body.username,
      "email": req.body.email,
      "first_name": req.body.first_name,
      "last_name": req.body.last_name,
      "gender": req.body.gender,
      "password": password.toString("hex"),
      "createdAt": Date.now(),
      "updatedAt": Date.now(),
      "roleId": 1
    });

    return res.json(createdUser);
  }
  catch(err) {
    return res.status(403).json({
      status: 403,
      status_type: "Forbidden",
      error: String(err)
    });
  }


});

// ==============================>>
//              Logout
// ==============================>>

router.post("/logout", (req, res, next) => {
  try {
    if (!req.session.token) throw "Logging out failed!"
    req.session.token = undefined;

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Logged out successfully"
    });
  }

  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      error: String(err)
    })
  }

});

// ==============================>>
//              Roles
// ==============================>>

router.get("/roles", authentication, isStaff, async (req, res, next) => {

  try {
    const allRoles = await Role.findAll(
      { order: [
          ['level', 'ASC'],
          ['name', 'ASC']
      ]}
    );

    if (!allRoles) throw "Could not fetch roles!"

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Showing all roles",
      roles: allRoles
    })
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      error: String(err)
    })
  }


});

router.get("/roles/:name", authentication, isStaff, async (req, res, next) => {

  try {
    const nameToCheck = capitalizeFirst(req.params.name)
    const oneRole = await Role.findAll({where: {name: nameToCheck}});

    if (!oneRole) throw "Could not find role!"

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Showing one role role",
      roles: oneRole
    })
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      error: String(err)
    })
  }

});

router.post("/role", authentication, isStaff, async (req, res, next) => {

  try {
    const userRoleCheck = checkUserRole(jwt.verify(req.session.token, process.env.TOKEN_SECRET).username, req.body.role);

    if (userRoleCheck === NaN) throw "Something went wrong!";
    if (userRoleCheck < req.body.level) throw "You dont have permission!";

    const roleExist = await Role.findOne({ where: { name : req.body.role} });

    if (roleExist) throw "Unable to create role, role already exist!";

    await Role.create({ name: req.body.role, level: req.body.level});

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: `Successfully Created Role: ${req.body.role}`,
    })
  }
  catch(err) {
    return res.status(403).json({
      status: 403,
      status_type: "Forbidden",
      message: "Unable to create role",
      err: String(err)
    });
  }
});

router.put("/role", authentication, isStaff, async (req, res, next) => {

  try {
    const userRoleCheck = checkUserRole(jwt.verify(req.session.token, process.env.TOKEN_SECRET).username, req.body.role);

    if (userRoleCheck === NaN) throw "Something went wrong!";
    if (userRoleCheck < req.body.level) throw "You dont have permission!";

    const roleExist = await Role.findOne({ where: { name : req.body.role} });

    if (!roleExist) throw "Unable to update role, role does not exist!";

    const valuesToUpdate = { name: null, level: null };

    if (req.body.newName) valuesToUpdate.name = req.body.newName;
    if (req.body.newLevel) valuesToUpdate.level = req.body.newLevel;

    await Role.update(valuesToUpdate, {
      where: { name: req.body.role }
    });

    return res.status(201).json({
      status: 201,
      status_type: "OK",
      message: "Successfully updated role",
      role: req.body.role
    })

  }

  catch(err) {
    return res.status(403).json({
      status: 403,
      status_type: "Forbidden",
      message: "Unable to update role",
      err: String(err)
    });
  }

});

router.delete("/role", authentication, isStaff, async (req, res, next) => {

  try {
    const userRoleCheck = await checkUserRole(jwt.verify(req.session.token, process.env.TOKEN_SECRET).username, req.body.role);

    if (userRoleCheck === NaN) throw "Something went wrong!";
    if (userRoleCheck < req.body.level) throw "You dont have permission!";

    const roleExist = await Role.findOne({ where: { name : req.body.role} });

    if (!roleExist) throw "Unable to delete role, role does not exist!";

    await Role.destroy({ where: {name: req.body.role} });
    return res.status(201).json({
      status: 201,
      status_type: "OK",
      message: `Successfully Deleted Role: ${req.body.role}`,
    })

  }
  catch(err) {
    return res.status(403).json({
      status: 403,
      status_type: "Forbidden",
      error: String(err)
    })
  }

});

module.exports = router;