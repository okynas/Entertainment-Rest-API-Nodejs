const {authentication, isStaff, splitPersonName, FindOneActor, findEpisode, findSeason} = require("../middleware");

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
      status_type: "OK",
      message: "Retriving actors",
      actors: actor
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

router.get("/actors/:name", async (req, res, next) => {

  try {
    const {firstName, lastName} = splitPersonName(req.params.name);
    const actor = await FindOneActor(firstName, lastName);

    if (!actor) throw "Actor not found";

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Getting one actor",
      actor: actor,
    });
  }
  catch(err) {
    return res.status(400).json({
      status: 400,
      status_type: "Bad Request",
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
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      bio: req.body.bio,
      birthdate: Date.parse(req.body.birthdate) || Date.now()
    });

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Successfully created actor",
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

    if (!req.body.id) throw "Please provide id";

    const findActor = await Actor.findOne({where: {id: req.body.id}});

    if (!findActor) throw "Can't update actor. Actor does not exists!";

    const valuesToUpdate = {
      first_name: undefined,
      last_name: undefined,
      bio: undefined,
      birthdate: undefined
    };

    if (req.body.first_name) valuesToUpdate.first_name = req.body.first_name;
    if (req.body.last_name) valuesToUpdate.last_name = req.body.last_name;
    if (req.body.bio) valuesToUpdate.bio = req.body.bio;
    if (req.body.birthdate) {
      let dateTime = Date.parse(req.body.birthdate)
      if (dateTime === NaN) throw "Birthdate is not valid!";
      valuesToUpdate.birthdate = new Date(req.body.birthdate)
    }

    await Actor.update(valuesToUpdate, {where: {id: Number.parseInt(req.body.id)}});

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Successfully update actor",
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

router.delete("/actors", authentication, isStaff, async (req, res, next) => {

  try {

    if (!req.body.id) throw "Please provide id";

    const findActor = await Actor.findOne({where: {id: req.body.id}})

    if (!findActor) throw "Could not delete actor, it does not exists!";

    await Actor.destroy({where: {id: req.body.id}});

    return res.status(201).json({
      status: 201,
      status_type: "Created",
      message: "Successfully deleted actor",
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

    if (!req.body.id) throw "Please provide id!";

    const lang = await Language.findOne({where: {id : req.body.id}});

    if (!lang) throw "Can't update language, it does not exists!";

    const valuesToUpdate = {
      language: undefined
    }

    if (req.body.language) valuesToUpdate.language = req.body.language;

    await Language.update(valuesToUpdate,{ where: {id : req.body.id }});

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

    if (!req.body.id) throw "Please provide id";

    const lang = await Language.findOne({where: {id : req.body.id}});

    if (!lang) throw "Can't delete language, it does not exists!";

    await Language.destroy({ where: {id : req.body.id }});

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
    if (!req.body.id) throw "Please provide id";

    const genres = await Genre.findOne({where: {id: req.body.id}});

    if (!genres) throw "Can't update genre, it does not exist!";

    if (genres.genre === req.body.genre) throw "Can't update genre that has the same name";

    const valuesToUpdate = {
      genre: undefined
    }

    if (req.body.genre) valuesToUpdate.genre = req.body.genre;

    await Genre.update(valuesToUpdate,{ where :{id: req.body.id} });

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
    if (!req.body.id) throw "Please provide id";

    const genres = await Genre.findOne({where: {id: req.body.id}});

    if (!genres) throw "Can't delete genre, it does not exist!";

    await Genre.destroy({ where :{id: req.body.id} }
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

router.post("/film", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.title) throw "Please provide title!";

    const film = await Film.findOne({ where: { title: req.body.title } });

    if (film) throw "Can't create film, it already exists!";

    await Film.create({
      title: req.body.title,
      poster: req.body.poster,
      description: req.body.description,
      releasedate: Date.now(),
      trailer: req.body.trailer,
      languageId: Number.parseInt(req.body.languageId),
      genreId: Number.parseInt(req.body.genreId),
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully created film!",
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

router.put("/film", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.id) throw "Please provide id !";

    const film = await Film.findOne({ where: { id: req.body.id } });

    if (!film) throw "Can't update film, it doesnt exists!";

    const valuesToUpdate = {
      title: undefined,
      poster: undefined,
      description: undefined,
      releasedate: undefined,
      trailer: undefined,
      languageId: undefined,
      genreId: undefined,
    }

    if (req.body.title) valuesToUpdate.title = req.body.title;
    if (req.body.poster) valuesToUpdate.poster = req.body.poster;
    if (req.body.description) valuesToUpdate.description = req.body.description;
    if (req.body.releasedate) valuesToUpdate.releasedate =  Date.parse(req.body.releasedate);
    if (req.body.trailer) valuesToUpdate.trailer = req.body.trailer;
    if (req.body.languageId) valuesToUpdate.languageId = Number.parseInt(req.body.languageId);
    if (req.body.genreId) valuesToUpdate.genreId = Number.parseInt(req.body.genreId);

    await Film.update(valuesToUpdate,{ where :{id: req.body.id} });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully update film!",
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

router.delete("/film", async (req, res, next) => {
  try {

    if (!req.body.id) throw "Please provide id!";

    const film = await Film.findOne({ where: { id: req.body.id } });

    if (!film) throw "Can't delete film, it already exists!";

    await Film.destroy({ where :{id: req.body.id} });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully deleted film!",
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
          as: 'language',
        },
        {
          model: Season,
          as: "seasons",
          attributes : ['id', 'title', 'description', 'releasedate'],
          include: {
            model: Episode,
            as: "episodes",
            attributes : ['id', 'title', 'description', 'releasedate', 'length', 'seasonId'],
          }
        }
      ],
    });

    if (!shows || shows.length === 0) throw new Error("Show not found");

    return res.status(200).json({
      staus: 200,
      status_type: "OK",
      message: "Get all shows",
      shows,
    });
  }
  catch(err) {
    return res.status(400).json({
      staus: 400,
      status_type: "Bad Request",
      message: "Error",
      error: String(err)
    });
  }

});

router.post("/show", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.title) throw "Please provide title!";

    const show = await Show.findOne({ where: { title: req.body.title } });

    if (show) throw "Can't create show, it already exists!";

    await Show.create({
      title: req.body.title,
      poster: req.body.poster,
      description: req.body.description,
      releasedate: Date.now(),
      trailer: req.body.trailer,
      languageId: Number.parseInt(req.body.languageId),
      genreId: Number.parseInt(req.body.genreId),
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully created show!",
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

router.put("/show", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.id) throw "Please provide id!";

    const show = await Show.findOne({ where: { id: req.body.id } });

    if (!show) throw "Can't update show, it doesnt exists!";

    const valuesToUpdate = {
      title: undefined,
      poster: undefined,
      description: undefined,
      releasedate: undefined,
      trailer: undefined,
      languageId: undefined,
      genreId: undefined,
    }

    if (req.body.title) valuesToUpdate.title = req.body.title;
    if (req.body.poster) valuesToUpdate.poster = req.body.poster;
    if (req.body.description) valuesToUpdate.description = req.body.description;
    if (req.body.releasedate) valuesToUpdate.releasedate =  Date.parse(req.body.releasedate);
    if (req.body.trailer) valuesToUpdate.trailer = req.body.trailer;
    if (req.body.languageId) valuesToUpdate.languageId = Number.parseInt(req.body.languageId);
    if (req.body.genreId) valuesToUpdate.genreId = Number.parseInt(req.body.genreId);

    await Show.update(valuesToUpdate,{ where :{id: req.body.id} });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully update show!",
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

router.delete("/show", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.id) throw "Please provide id!";

    const show = await Show.findOne({ where: { id: req.body.id } });

    if (!show) throw "Can't delete show, it already exists!";

    await Show.destroy({ where :{id: req.body.id} });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully deleted show!",
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
//            SEASON
// ==============================>>

router.get("/season", async (req, res, next) => {
  try {
    const season = await Season.findAll({
      attributes: ['id', 'title', 'releasedate', 'description', 'showId'],
      include: {
        model: Episode,
        as: "episodes",
        attributes : ['id', 'title', 'description', 'releasedate', 'length', 'seasonId'],
      }
    });

    if (!season || season.length === 0) throw "Season not found";

    return res.status(200).json({
      status: 200,
      status_type: "OK",
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

router.post("/season", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.title) throw "Please provide title!";
    if (!req.body.showId) throw "Please provide Show Id!";

    const season = await Season.findOne({ where: { title: req.body.title } });

    if (season) throw "Can't create season, it already exists!";

    const show = await Show.findOne({where: {id: req.body.showId}});
    if (!show) throw "Can't create season with that specific show";

    await Season.create({
      title: req.body.title,
      releasedate: Date.parse(req.body.releasedate),
      description: req.body.description,
      showId: Number.parseInt(show.id),
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully created season!",
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

router.put("/season", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.id) throw "Please provide id!";

    const season = await Season.findOne({ where: { id: req.body.id } });

    if (!season) throw "Can't update season, it doesnt exists!";

    const valuesToUpdate = {
      title: undefined,
      releasedate: undefined,
      description: undefined,
      showId: undefined,
    }

    if (req.body.title) valuesToUpdate.title = req.body.title;
    if (req.body.description) valuesToUpdate.description = req.body.description;
    if (req.body.releasedate) valuesToUpdate.releasedate =  new Date(req.body.releasedate);
    if (req.body.showId) {
      const show = await Show.findOne({where: {id: req.body.showId}});
      if (!show) throw "Can't update season with that specific show";
      valuesToUpdate.showId = Number.parseInt(show.id);
    }

    await Season.update(valuesToUpdate, { where :{id: req.body.id} } );

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully update season!",
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

router.delete("/season", authentication, isStaff, async (req, res, next) => {
  try {
    if (!req.body.id) throw "Provide id!";

    const season = await Season.findOne({where: {id: req.body.id}});

    if (!season) throw "Can't delete season, it does not exists!";

    await Season.destroy({where : {id: season.id}});

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully deleted season!",
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
//            EPISODE
// ==============================>>

router.get("/episodes", async (req, res, next) => {
  try {
    const ep = await Episode.findAll();

    if (!ep || ep.length === 0) throw "Episodes not found";

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Getting all Episodes",
      episodes: ep
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

router.post("/episodes", authentication, isStaff, async (req, res, next) => {
  try {
    const episode = await findEpisode(req.body.title, req.body.showId, req.body.seasonId);
    if (episode) throw "Can't update episode, it doesnt exists!";

    await Episode.create({
      title: req.body.title,
      releasedate: Date.parse(req.body.releasedate),
      description: req.body.description,
      length: Number.parseInt(req.body.length),
      seasonId: Number.parseInt(req.body.seasonId),
      showId: Number.parseInt(req.body.showId),
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully created episode!",
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

router.put("/episodes", authentication, isStaff, async (req, res, next) => {
  try {
    if (!req.body.id) throw "Please provide id!";
    const episode = await Episode.findOne({where: {id: req.body.id}});
    if (!episode) throw "Can't update episode, it doesnt exists!";

    const valuesToUpdate = {
      seasonId: undefined,
      title: undefined,
      releasedate: undefined,
      description: undefined,
      showId: undefined,
      length: undefined
    }

    if (req.body.seasonId) valuesToUpdate.seasonId = Number.parseInt(req.body.seasonId);
    if (req.body.title) valuesToUpdate.title = req.body.title;
    if (req.body.description) valuesToUpdate.description = req.body.description;
    if (req.body.releasedate) valuesToUpdate.releasedate =  new Date(req.body.releasedate);
    if (req.body.showId) valuesToUpdate.showId = Number.parseInt(req.body.showId);
    if (req.body.length) valuesToUpdate.length = Number.parseInt(req.body.length);

    if (JSON.stringify(valuesToUpdate) == JSON.stringify(episode)) throw "Can't update when all the values are the same.";

    await Episode.update(valuesToUpdate,{ where: {id: req.body.id} });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully update episode!"
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

router.delete("/episodes", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.id) throw "Please provide id!";

    const episode = await Episode.findOne({where : {id: req.body.id}});

    if (!episode) throw "Can't delete episode, it does not exists!";

    await Episode.destroy({where : {id: req.body.id}});

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully deleted episode!",
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

module.exports = router;