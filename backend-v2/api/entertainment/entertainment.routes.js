const {authentication, isStaff, splitPersonName, FindOneActor} = require("../middleware");

const express = require("express");
const router = express.Router();

const sequelize = require("../../db/db.config");
const { Op } = require("sequelize");

const Actor = sequelize.Actor;
const Language = sequelize.Language;
const Film = sequelize.Film;
const Show = sequelize.Show;
const Genre = sequelize.Genre;
const Season = sequelize.Season;
const Episode = sequelize.Episode;


// ==============================>>
//            ACTORS
// ==============================>>

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
      error: String(err)
    })
  }
});

router.get("/actors/:name", async (req, res, next) => {

  try {
    const {firstName, lastName} = splitPersonName(req.params.name);
    const actor = await FindOneActor(firstName, lastName);

    if (!actor) throw "Actor not found";

    return res.status(200).json({
      status: 200,
      message: "Getting one actor",
      actor: actor,
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: String(err)
    })
  }

});

router.post("/actors", authentication, async (req, res, next) => {
  try {
    if (!req.body.first_name) throw "Please supply with firstname to create actor";
    if (!req.body.last_name) throw "Please supply with lastname to create actor";

    const findActor = await FindOneActor(req.body.first_name, req.body.last_name);

    if (findActor) throw "Can't create actor. Actor already exists!";

    await Actor.create({
      "first_name": req.body.first_name,
      "last_name": req.body.last_name,
      "bio": req.body.bio,
      "birthdate": Date.now()
    });

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Created actor",
    });
  }
  catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: String(err)
    })
  }
});

router.put("/actors", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.first_name) throw "Please provide firstname";
    if (!req.body.last_name) throw "Please provide lastname";

    const findActor = await FindOneActor(req.body.first_name, req.body.last_name);

    if (!findActor) throw "Can't update actor. Actor does not exists!";

    const valuesToUpdate = {
      first_name: null,
      last_name: null,
      bio: null,
      birthdate: null
    };

    if (req.body.first_name) valuesToUpdate.first_name = req.body.first_name;
    if (req.body.last_name) valuesToUpdate.last_name = req.body.last_name;
    if (req.body.bio) valuesToUpdate.bio = req.body.bio;
    if (req.body.birthdate) {

      let dateTime = Date.parse(req.body.birthdate)

      if (dateTime === NaN) throw "Birthdate is not valid!";

      valuesToUpdate.birthdate = new Date(req.body.birthdate)
    }

    await Actor.update(valuesToUpdate, {
      where: {id: req.body.id}
    });

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Created actor",
    });
  }
  catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: String(err)
    })
  }
});

router.delete("/actors", authentication, isStaff, async (req, res, next) => {

  try {
    if (!req.body.first_name) throw "Please supply with firstname to delete actor";
    if (!req.body.last_name) throw "Please supply with lastname to delete actor";

    const findActor = await FindOneActor(req.body.first_name, req.body.last_name );

    if (!findActor) throw "Could not delete actor, it does not exists!";

    await Actor.destroy({
      where: {
        [Op.and]: [
          {first_name:  findActor.first_name},
          {last_name: findActor.last_name}
        ]
      }
    });

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Deleted successfully",
    });
  }
  catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: String(err)
    })
  }
});

// ==============================>>
//           LANGUAGES
// ==============================>>

router.get("/language", async (req, res, next) => {
  try {
    const languages = await Language.findAll();

    if (!languages || languages.length === 0) throw "Languages not found";

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
      error: String(err)
    });
  }

});

router.post("/language", async (req, res, next) => {
  try {

    if (!req.body.language) throw "Please give the language a name, title or langauge";

    const lang = await Language.findOne({where: {language : req.body.language}});

    if (lang) throw "Can't create language, it already exists!";

    await Language.create({language: req.body.language});

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Successfully created language!",
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: String(err)
    });
  }
});

router.put("/language", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.newLanguage) throw "Please provide the new language name!";
    if (!req.body.language) throw "Please provide the old language name to the language to update!";

    const lang = await Language.findOne({where: {language : req.body.language}});

    if (!lang) throw "Can't update language, it does not exists!";

    const valuesToUpdate = {
      language: null
    }

    if (req.body.newLanguage) valuesToUpdate.language = req.body.newLanguage;

    await Language.update(valuesToUpdate,
      { where: {language : req.body.language }
    });

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Successfully update language!",
    });
  }

  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      message: "Error",
      error: String(err)
    });
  }
});

router.delete("/language", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.language) throw "Please provide the language name to delete";

    const lang = await Language.findOne({where: {language : req.body.language}});

    if (!lang) throw "Can't delete language, it does not exists!";

    await Language.destroy({ where: {language : req.body.language }});

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Successfully deleted language!",
    });
  }

  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      message: "Error",
      error: String(err)
    });
  }
});

// ==============================>>
//            GENRE
// ==============================>>

router.get("/genre", async (req, res, next) => {
  try {
    const genres = await Genre.findAll();

    if (!genres || genres.languages === 0) throw "Genres not found";

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Getting all genres",
      genre: genres
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      message: "Error",
      error: String(err)
    });
  }

});

router.post("/genre", async (req, res, next) => {
  try {
    const genres = await Genre.findOne({where: {genre: req.body.genre}});

    if (genres) throw "Can't create genre, it already exists!";

    await Genre.create({genre: req.body.genre});

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully created genre!",
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      message: "Error",
      error: String(err)
    });
  }

});

router.put("/genre", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.newGenre) throw "Please provide name for new genre";
    if (!req.body.genre) throw "Please provide name for old genre";

    const genres = await Genre.findOne({where: {genre: req.body.genre}});

    if (!genres) throw "Can't update genre, it does not exist!";

    const valuesToUpdate = {
      genre: null
    }

    if (req.body.newGenre) valuesToUpdate.genre = req.body.newGenre;

    await Genre.update(valuesToUpdate,
      { where :{genre: req.body.genre} }
    );

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully updated genre!",
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      message: "Error",
      error: String(err)
    });
  }

});

router.delete("/genre", authentication, isStaff, async (req, res, next) => {
  try {
    if (!req.body.genre) throw "Please provide name for genre";

    const genres = await Genre.findOne({where: {genre: req.body.genre}});

    if (!genres) throw "Can't delete genre, it does not exist!";

    await Genre.destroy({ where :{genre: req.body.genre} }
    );

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully deleted genre!",
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      message: "Error",
      error: String(err)
    });
  }

});

// ==============================>>
//            FILM
// ==============================>>

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
            as: "role"
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

    if (!films || films.length === 0) throw "films not found"

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Retrieving all films ✨",
      films: films
    });
  }
  catch (err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
      message: "Error",
      error: String(err)
    })
  }

});

// ==============================>>
//             SHOW
// ==============================>>

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
        },
        {
          model: Season,
          as: "seasons",
          attributes : ['title', 'description', 'releasedate', 'seasonNumber'],
          include: {
            model: Episode,
            as: "episodes",
            attributes : ['id', 'title', 'description', 'releasedate', 'seasonNumber', 'length'],
          }
        }
      ],
    });

    if (!shows || shows.length === 0) throw new Error("Film not found");

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

// ==============================>>
//            SEASON
// ==============================>>

router.get("/season", async (req, res, next) => {
  try {
    const season = await Season.findAll({
      attributes: ['seasonNumber', 'title', 'releasedate', 'description']
    });

    if (!season || season.length === 0) throw "Genres not found";

    return res.status(200).json({
      status: 200,
      message: "Getting all Seasons",
      season: season
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: String(err)
    });
  }

});

// ==============================>>
//            EPISODE
// ==============================>>

router.get("/episodes", async (req, res, next) => {
  try {
    const ep = await Episode.findAll();

    if (!ep || ep.length === 0) throw "Episodes not found";

    return res.status(200).json({
      status: 200,
      message: "Getting all Episodes",
      episodes: ep
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      message: "Error",
      error: String(err)
    });
  }

});

module.exports = router;