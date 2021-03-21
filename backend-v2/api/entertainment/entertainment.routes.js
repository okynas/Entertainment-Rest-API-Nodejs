const {authentication, isStaff} = require("../middleware");

const express = require("express");
const router = express.Router();

const sequelize = require("../../db/db.config");
// const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const Actor = sequelize.Actor;
const Language = sequelize.Language;
const Entertainment = sequelize.Entertainment;
const Film = sequelize.Film;
const Genre = sequelize.Genre;

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    status: 200,
    message: "OK - Welcome to entertainment ✨",
  });
});

router.get("/actors", async (req, res, next) => {

    const actor = await Actor.findAll();

    return res.status(200).json({
      status: 200,
      message: "Retriving actors",
      actors: actor
    });
});

router.get("/actors/:name", async (req, res, next) => {

  const actorName = req.params.name;
  const split = actorName.split(" ");
  const antallNavn = split.length;
  var actor;

  if (antallNavn > 1) {
    let first_name = split[0]
    let last_name = split[antallNavn - 1]

    actor = await Actor.findOne({
      where: {
        [Op.or]: [
          {first_name: first_name },
          {last_name: last_name }
        ]
      }
    });
  } else {
    actor = await Actor.findOne({
      where: {first_name: actorName }
    });
  }


  return res.status(200).json({
    status: 200,
    message: "Getting one actor",
    actor: actor,
  })
});

router.get("/language", async (req, res, next) => {
  const languages = await Language.findAll();
  return res.status(200).json({
    status: 200,
    message: "Getting all lang",
    languages: languages
  });
});

router.get("/entertainment", async (req, res, next) => {

  const entertainments = await Entertainment.findAll({
    attributes: ['title', 'poster', 'description','releasedate', 'trailer'],
    include: [
      {
        model: Actor ,
        as : "Actors",
        attributes: ['first_name', 'last_name', 'bio','birthdate'],
        through: {
          attributes: ['id', "role"],
          as: "roleInShow"
        }
      },{
        model: Genre,
        as: 'genre'
      },{
        model: Language,
        as: 'language'
      }
    ],
  });

  return res.status(200).json({
    status: 200,
    message: "Retrieving entertainment ✨",
    entertainment: entertainments
  });
});

router.get("/films", async (req, res, next) => {
  const allFilms = await Film.findAll();
  res.status(200).json({
    staus: 200,
    message: "Get all films",
    allFilms
  })
})

module.exports = router;