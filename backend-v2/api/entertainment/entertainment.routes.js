const {authentication, isStaff} = require("../middleware");

const express = require("express");
const router = express.Router();

const sequelize = require("../../db/db.config");
const { Op } = require("sequelize");

const Actor = sequelize.Actor;
const Language = sequelize.Language;
// const Entertainment = sequelize.Entertainment;
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

// router.get("/genre", async (req, res, next) => {
//   try {
//     const genres = await Genre.findAll();

//     if (!genres) throw "Genres not found";

//     return res.status(200).json({
//       status: 200,
//       message: "Getting all genres",
//       genre: genres
//     });
//   }
//   catch(err) {
//     return res.status(400).json({
//       status: 400,
//       message: "Error",
//       error: err
//     });
//   }

// });

router.get("/film", async (req, res, next) => {

  try {
    const films = await Film.findAll({
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

    if (!films) throw "films not found"

    return res.status(200).json({
      status: 200,
      message: "Retrieving all films ✨",
      films: films
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

router.get("/show", async (req, res, next) => {
  try {
    const shows = await Show.findAll({
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
          as: 'language',
          // attributes: ['language']
        },
        {
          model: Season,
          as: "seasons",
          // attributes: ['title', 'releasedate', 'description'],
        }
      ],
    });

    if (!shows) throw new Error("Film not found");

    return res.status(200).json({
      staus: 200,
      message: "Get all shows",
      shows,
    });
  }
  catch(err) {
    return res.status(400).json({
      staus: 400,
      message: "Error",
      error: String(err)
    });
  }

});

// router.get("/season", async (req, res, next) => {
//   try {
//     const season = await Season.findAll(
//       {
//       attributes: ['title', 'seasonNumber', 'releasedate', 'description'],
//       include: [
//         {
//           model: Show,
//           as: "shows",
//           // through: {
//             // attributes: [],
//             // as: "genreInShow"
//           // },
//           // include: {
//           //   model: Show,
//           //   as: 'shows',
//           //   attributes: ['id', 'title', 'poster', 'description', 'releasedate', 'trailer'],
//           //   include: [
//           //     {
//           //       model: Language,
//           //       as: 'language',
//           //       attributes: ['language']
//           //     }
//           //   ]
//           // }
//         }
//       ]
//     }
//     );

//     if (!season) throw "Season not found"

//     return res.status(200).json({
//       staus: 200,
//       message: "Get all seasons",
//       season
//     });
//   }
//   catch(err) {
//     return res.status(400).json({
//       staus: 400,
//       message: "Error",
//       error: String(err)
//     });
//   }

// });

module.exports = router;