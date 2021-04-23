const {authentication, isStaff} = require("../middleware");
const sequelize = require("../../db/db.config");
const Film = sequelize.Film;
const Actor = sequelize.Actor;
const ActorsInFilm = sequelize.Film_has_actors;

const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();

// ==============================>>
//         ACTOR IN FILM
// ==============================>>

router.get("/", async (req, res, next) => {

  try {
    const AiF = await ActorsInFilm.findAll();

    if (!AiF || AiF.length === 0) throw "films not found"

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Retrieving all actors films ✨",
      actorsInFilm: AiF
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

router.post("/", authentication, isStaff,  async (req, res, next) => {
  try {

    if (!req.body.filmId) throw "Please provide film id!";
    if (!req.body.actorId) throw "Please provide actor id!";
    if (!req.body.role) throw "Please provide role!";

    const aif = await ActorsInFilm.findOne({
      where: {
        [Op.and] :[
          { filmId: req.body.filmId },
          { role: req.body.role },
          { actorId: req.body.actorId },
        ]
      }
    });

    if (aif) throw "Can't add actor to film, that combination already exist!";

    const actor = await Actor.findByPk(req.body.actorId)
    const film = await Film.findByPk(req.body.filmId)

    if (!actor) throw "could not fetch actor"
    if (!film) throw "could not fetch film"

    await ActorsInFilm.create({
      "filmId": Number(req.body.filmId),
      "role": req.body.role,
      "actorId": Number(req.body.actorId),
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully added actor to film!",
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

// router.put("/", authentication, isStaff, async (req, res, next) => {
//   try {

//     if (!req.body.id) throw "Please provide id !";

//     const film = await Film.findOne({ where: { id: req.body.id } });

//     if (!film) throw "Can't update film, it doesnt exists!";

//     const valuesToUpdate = {
//       title: undefined,
//       poster: undefined,
//       description: undefined,
//       releasedate: undefined,
//       trailer: undefined,
//       languageId: undefined,
//       genreId: undefined,
//     }

//     if (req.body.title) valuesToUpdate.title = req.body.title;
//     if (req.body.poster) valuesToUpdate.poster = req.body.poster;
//     if (req.body.description) valuesToUpdate.description = req.body.description;
//     if (req.body.releasedate) valuesToUpdate.releasedate =  Date.parse(req.body.releasedate);
//     if (req.body.trailer) valuesToUpdate.trailer = req.body.trailer;
//     if (req.body.languageId) valuesToUpdate.languageId = Number.parseInt(req.body.languageId);
//     if (req.body.genreId) valuesToUpdate.genreId = Number.parseInt(req.body.genreId);

//     await Film.update(valuesToUpdate,{ where :{id: req.body.id} });

//     return res.status(200).json({
//       status: 201,
//       status_type: "Created",
//       message: "Successfully update film!",
//     });
//   }
//   catch(err) {
//     return res.status(400).json({
//       status: 400,
//       status_type: "Bad Request",
//       message: "Error",
//       error: String(err)
//     });
//   }
// });

router.delete("/", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.filmId) throw "Please provide film id!";
    if (!req.body.actorId) throw "Please provide actor id!";

    const aif = await ActorsInFilm.findOne({
      where: {
        [Op.and] :[
          { filmId: req.body.filmId },
          { actorId: req.body.actorId },
        ]
      }
    });

    if (!aif) throw "Can't add actor to film, that combination does not exist!";

    await ActorsInFilm.destroy({ where :
      {
        [Op.and] : [
          {filmId: req.body.filmId},
          {actorId: req.body.actorId}
        ]
      }
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully removed actor to that film!",
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