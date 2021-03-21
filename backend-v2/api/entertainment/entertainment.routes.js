const {authentication, isStaff} = require("../middleware");

const express = require("express");
const router = express.Router();

const sequelize = require("../../db/db.config");
const { Op } = require("sequelize");

const Actor = sequelize.Actor;
const Language = sequelize.Language;
const Entertainment = sequelize.Entertainment;
const Film = sequelize.Film;
const Show = sequelize.Show;
const Genre = sequelize.Genre;
const Season = sequelize.Season;

router.get("/actors", async (req, res, next) => {

  try {
    const actor = await Actor.findAll();

    if (!actor) throw "Actor not found"

    return res.status(200).json({
      status: 200,
      message: "Retriving actors",
      actors: actor
    });
  }
  catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: err
    })
  }
});

router.get("/actors/:name", async (req, res, next) => {

  try {
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

    if (!actor) throw "Actor not found";

    return res.status(200).json({
      status: 200,
      message: "Getting one actor",
      actor: actor,
    })
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: err,
    })
  }



});

router.get("/language", async (req, res, next) => {
  try {
    const languages = await Language.findAll();

    if (!languages) throw "Languages not found";

    return res.status(200).json({
      status: 200,
      message: "Getting all languages",
      languages: languages
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: err
    });
  }

});

router.get("/genre", async (req, res, next) => {
  try {
    const genres = await Genre.findAll();

    if (!genres) throw "Genres not found";

    return res.status(200).json({
      status: 200,
      message: "Getting all genres",
      genre: genres
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: err
    });
  }

});

router.get("/entertainment", async (req, res, next) => {

  try {
    const entertainment = await Entertainment.findAll({
      attributes: ['id', 'title', 'poster', 'description','releasedate', 'trailer'],
      include: [
        {
          model: Actor ,
          as : "Actors",
          attributes: ['id', 'first_name', 'last_name', 'bio','birthdate'],
          through: {
            attributes: ['role'],
            as: "roleInShow"
          }
        },
        {
          model: Genre,
          as: 'Genre',
          attributes: ['genre'],
          through: {
            attributes: [],
            as: "genreInShow"
          }
        },
        {
          model: Language,
          as: 'language'
        }
      ],
    });

    if (!entertainment) throw "entertainment not found"

    return res.status(200).json({
      status: 200,
      message: "Retrieving all entertainment ✨",
      entertainment: entertainment
    });
  }
  catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: err
    })
  }

});

router.get("/entertainment/:nameOrId", async (req, res, next) => {
  try {
    const entertainment = await Entertainment.findOne({
      where: {
        [Op.or]: [
          {id: req.params.nameOrId },
          {title: req.params.nameOrId}
        ]
      },
      attributes: ['id', 'title', 'poster', 'description','releasedate', 'trailer'],
      include: [
        {
          model: Actor ,
          as : "Actors",
          attributes: ['id', 'first_name', 'last_name', 'bio','birthdate'],
          through: {
            attributes: ['role'],
            as: "roleInShow"
          }
        },
        {
          model: Genre,
          as: 'Genre',
          attributes: ['genre'],
          through: {
            attributes: [],
            as: "genreInShow"
          }
        },
        {
          model: Language,
          as: 'language'
        }
      ],
    });

    if (!entertainment) throw "entertainment not found";

    return res.status(200).json({
      status: 200,
      message: "Getting One entertainment",
      entertainment: entertainment
    });
  }
  catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: err,
    });
  }
});

router.get("/films", async (req, res, next) => {
  try {
    const films = await Film.findAll({
      attributes: ['duration'],
      include: [{
       model: Entertainment,
       as: 'entertainmentFilm',
       attributes: ['id', 'title', 'poster', 'description', 'releasedate', 'trailer'],
       include: [
        {
          model: Actor ,
          as : "Actors",
          attributes: ['id', 'first_name', 'last_name', 'bio','birthdate'],
          through: {
            attributes: ['role'],
            as: "roleInShow"
          }
        },
        {
          model: Genre,
          as: 'Genre',
          attributes: ['genre'],
          through: {
            attributes: [],
            as: "genreInShow"
          }
        },
        {
          model: Language,
          as: 'language'
        }
      ],
      }]
    });

    if (!films) throw "Film not found"

    return res.status(200).json({
      staus: 200,
      message: "Get all films",
      films
    });
  }
  catch(err) {
    return res.status(400).json({
      staus: 400,
      message: "Error",
      error: err
    });
  }

});

router.get("/show", async (req, res, next) => {
  try {
    const shows = await Show.findAll({
      attributes: {
        exclude: ["entertainmentId"]
      },
      include: [{
       model: Entertainment,
       as: 'entertainmentShow',
       attributes: ['id', 'title', 'poster', 'description', 'releasedate', 'trailer'],
       include: [
        {
          model: Actor ,
          as : "Actors",
          attributes: ['id', 'first_name', 'last_name', 'bio','birthdate'],
          through: {
            attributes: ['role'],
            as: "roleInShow"
          }
        },
        {
          model: Genre,
          as: 'Genre',
          attributes: ['genre'],
          through: {
            attributes: [],
            as: "genreInShow"
          }
        },
        {
          model: Language,
          as: 'language'
        }
      ],
      }]
    });

    if (!shows) throw "Film not found"

    return res.status(200).json({
      staus: 200,
      message: "Get all shows",
      shows
    });
  }
  catch(err) {
    return res.status(400).json({
      staus: 400,
      message: "Error",
      error: err
    });
  }

});

router.get("/season", async (req, res, next) => {
  try {

    const season = await Season.findAll();

    if (!season) throw "Season not found"

    return res.status(200).json({
      staus: 200,
      message: "Get all seasons",
      season
    });
  }
  catch(err) {
    return res.status(400).json({
      staus: 400,
      message: "Error",
      error: err
    });
  }

});

module.exports = router;