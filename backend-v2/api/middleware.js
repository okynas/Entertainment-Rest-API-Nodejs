const jwt = require("jsonwebtoken");
const crypto = require("crypto");

require('dotenv').config();

const sequelize = require("../db/db.config");

const User = sequelize.User;
const Role = sequelize.Role;
const Actor = sequelize.Actor;
const Language = sequelize.Language;
const Film = sequelize.Film;
const Show = sequelize.Show;
const Genre = sequelize.Genre;
const Season = sequelize.Season;
const Episode = sequelize.Episode;

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
    status_type: "Unauthorized",
    message: "You are not logged in! Please login to access"
  })
}

module.exports.alreadyLoggedIn = async function(req, res, next) {
  if (req.session.token) {
    return res.status(200).json({
      status: 200,
      status_type: "OK",
      user: `Logged in as: ${jwt.verify(req.session.token, process.env.TOKEN_SECRET).username}`,
      message: "Already logged in"
    });
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

    const rolleLevel = userToCheck["role"]["level"];

    if (rolleLevel >= 2) return next();

    throw "You do not have permission to this route!"

  }
  catch(err) {
    return res.status(401).json({
      status: 401,
      status_type: "Unauthorized",
      error: String(err)
    })
  }
}

module.exports.checkPermissionToOneUser = async function(username) {
  try {
    const {role} = await User.findOne({
      where: {username: username},
      include: ["role"],
    });

    if (role['level'] < 2) throw "You dont have permission to do this!"

    return role;
  }
  catch(err) {
    return null;
  }
}

module.exports.userExist = async function(req, res, next) {
  try {

    if (!req.body.username) throw "Please provide username";
    if (!req.body.email) throw "Please provide email";
    if (!req.body.password) throw "Please provide password";

    const key = crypto.pbkdf2Sync(req.body.password, process.env.PWD_HASH_SALT, Number(process.env.PWD_HASH_ITERATION), Number(process.env.PWD_HASH_LENGTH), process.env.PWD_HASH_ALGORITHM);
    const userToCheck = await User.findOne({
      where: {
        [Op.and] : [
          {username: req.body.username},
          {email: req.body.email},
          {password: key.toString("hex")},
        ]
      }
    });

    if (!userToCheck) throw "User not found";

    next();

  }

  catch(err) {
    return res.status(404).json({
      status: 404,
      status_type: "Not found",
      error: String(err)
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

    if (!userToCheck) throw "User does not exist";

    return userToCheck;

  }

  catch(err) {
    return null;
  }


}

module.exports.findUserAndLogIn = async function(username, email, password) {
  try {
    const key = crypto.pbkdf2Sync(password, process.env.PWD_HASH_SALT, Number(process.env.PWD_HASH_ITERATION), Number(process.env.PWD_HASH_LENGTH), process.env.PWD_HASH_ALGORITHM);

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
    });

    if(!userToCheck) throw "Could not find user!";

    return userToCheck.username;
  }
  catch(err) {
    return null;
  }

}

module.exports.checkUserRole = async function(currentUser, userOrRoleToCheck) {

  try {
    const {role} = await User.findOne({
      where: {username: currentUser},
      include: ["role"],
    });

    if (!role) throw "User does not exist!"

    const roleOfCurrentUser = role["level"]; // => 3 if admin

    if (!roleOfCurrentUser) throw "User does not have a role!"

    const {level} = await Role.findOne({
      where: {name: userOrRoleToCheck},
      attributes: ['level']
    });

    if (!level) throw "Could not find role!";
    if (roleOfCurrentUser < level) throw "You do not have permisson!";
    return roleOfCurrentUser;

  }
  catch(err) {
    return null
  }

}

module.exports.capitalizeFirst = function(string) {
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.splitPersonName = function(name) {
  const splittedName = name.split(" ");

  if (splittedName.length === 1)  return {firstName: name, lastName: null};

  const firstName = splittedName[0];
  const lastName = splittedName[splittedName.length - 1];

  return {firstName: firstName, lastName: lastName}
}

module.exports.FindOneActor = async function(firstname, lastname) {
  try {
    if (lastname === null) {
      return await Actor.findOne({
        where: {
          first_name: firstname
        }
      });
    }

    if (lastname) {
      return await Actor.findOne({
        where: {
          [Op.or]: [
            {first_name: firstname },
            {last_name: lastname }
          ]
        }
      });
    }
  }
  catch(err) {
    return null;
  }
}


module.exports.findEpisode = async function(title, showId, seasonId) {
  try {
    if (!title) throw "Please provide title!";
    if (!seasonId) throw "Please provide seasonId!";
    if (!showId) throw "Please provide showId!";

    const episode = await Episode.findOne({ where: {
      [Op.and] : [
        {showId: showId},
        {seasonId: seasonId},
        {title: title},
      ]
     } });

    if (!episode) throw "Can't update episode, it doesnt exists!";

    return episode;

  } catch(err) {
    return null;
  }

}

// module.exports.checkGenreInFilm = async function(filmId, genreId) {
//   try {
//     if (!filmId) throw "Please provide film id!";
//     if (!genreId) throw "Please provide actor id!";
  
//     const gif = await GenreInFilm.findOne({
//       where: {
//         [Op.and] :[
//           { filmId: filmId},
//           { genreId: genreId},
//         ]
//       }
//     });

//     // if (gif) throw "there is a film-genre combination"
  
//     const genre = await Genre.findByPk(genreId)
//     const film = await Film.findByPk(filmId)

//     if (!genre) throw "could not find genre"
//     if (!film) throw "could not find film"

//     return Object.assign({film: film, genre: genre})
//   }
//   catch(err) {
//     return String(err)
//   }

// }