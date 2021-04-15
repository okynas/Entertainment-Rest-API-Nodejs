const {authentication, isStaff} = require("../middleware");
const sequelize = require("../../db/db.config");
const Film = sequelize.Film;
const Actor = sequelize.Actor;
const ActorsInFilm = sequelize.Film_has_actors;

const express = require("express");
const router = express.Router();

// ==============================>>
//            FILM
// ==============================>>

router.get("/", async (req, res, next) => {

  try {
    const AiF = await ActorsInFilm.findAll();

    if (!AiF || AiF.length === 0) throw "films not found"

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Retrieving all films ✨",
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

// router.post("/", authentication, isStaff, async (req, res, next) => {
//   try {

//     if (!req.body.title) throw "Please provide title!";

//     const film = await Film.findOne({ where: { title: req.body.title } });

//     if (film) throw "Can't create film, it already exists!";

//     await Film.create({
//       title: req.body.title,
//       poster: req.body.poster,
//       description: req.body.description,
//       releasedate: Date.now(),
//       trailer: req.body.trailer,
//       languageId: Number.parseInt(req.body.languageId),
//     });

//     return res.status(200).json({
//       status: 201,
//       status_type: "Created",
//       message: "Successfully created film!",
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

// router.delete("/", async (req, res, next) => {
//   try {

//     if (!req.body.id) throw "Please provide id!";

//     const film = await Film.findOne({ where: { id: req.body.id } });

//     if (!film) throw "Can't delete film, it already exists!";

//     await Film.destroy({ where :{id: req.body.id} });

//     return res.status(200).json({
//       status: 201,
//       status_type: "Created",
//       message: "Successfully deleted film!",
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

module.exports = router;