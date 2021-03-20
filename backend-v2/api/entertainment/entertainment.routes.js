const {authentication, isStaff} = require("../middleware");

const express = require("express");
const router = express.Router();

const sequelize = require("../../db/db.config");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const Actor = sequelize.Actor;
const Language = sequelize.Language;
const Entertainment = sequelize.Entertainment;
const Entertainmens_has_actors = sequelize.Entertainmens_has_actors;
const Genre = sequelize.Genre;

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    status: 200,
    message: "OK - Welcome to entertainment ✨",
  });
});

router.get("/actors", async (req, res, next) => {

  if(req.query.first_name || req.query.last_name) {
    const actor = await Actor.findOne({
      where: {
        [Op.or]: [
          {first_name: req.query.first_name },
          {last_name: req.query.last_name }
        ]
      }
    });

    return res.status(200).json({
      actor: actor
    })
  } else {
    const actor = await Actor.findAll();

    return res.status(200).json({
      status: 200,
      message: "Retriving actors",
      actors: actor
    });
  }

});

router.get("/language", async (req, res, next) => {
  const languages = await Language.findAll();
  return res.status(200).json({
    status: 200,
    message: "Getting all lang",
    languages
  });
});

router.get("/entertainment", async (req, res, next) => {

  const entertainments = await Entertainment.findAll({
    // attributes: ['title', 'poster', 'description','releasedate', 'trailer'],
    include: ['Actors', 'language', 'genre'],
  });

  return res.status(200).json({
    status: 200,
    message: "OK - Welcome to entertainment ✨",
    entertainment: entertainments
  });
});

module.exports = router;