const {authentication, isStaff} = require("../middleware");
const sequelize = require("../../db/db.config");
const Show = sequelize.Show;
const Genre = sequelize.Genre;
const GenreInShow = sequelize.Show_has_genre;

const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();

// ==============================>>
//         GENRE IN FILM
// ==============================>>

router.get("/", async (req, res, next) => {

  try {
    const GiS = await GenreInShow.findAll();

    if (!GiS || GiS.length === 0) throw "genre in shows not found"

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Retrieving all genre in shows ✨",
      genreInShow: GiS
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

router.post("/", authentication, isStaff, async (req, res, next) => {
  try {

    if (!req.body.showId) throw "Please provide show id!";
    if (!req.body.genreId) throw "Please provide actor id!";

    const gif = await GenreInShow.findOne({
      where: {
        [Op.and] :[
          { showId: req.body.showId },
          { genreId: req.body.genreId },
        ]
      }
    });

    const genre = await Genre.findByPk(req.body.genreId)
    const show = await Show.findByPk(req.body.showId)

    if (gif) throw "Can't add actor to film, that combination already exist!";
    if (!genre) throw "could not fetch genre"
    if (!show) throw "could not fetch show"

    await GenreInShow.create({
      "showId": Number(show.id),
      "genreId": Number(genre.id),
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully added genre to film!",
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


    if (!req.body.showId) throw "Please provide show id!";
    if (!req.body.genreId) throw "Please provide actor id!";

    const gif = await GenreInShow.findOne({
      where: {
        [Op.and] :[
          { showId: req.body.showId },
          { genreId: req.body.genreId },
        ]
      }
    });

    if (!gif) throw "Can't add genre to show, that combination does not exist!";

    await GenreInShow.destroy({ where :
      {
        [Op.and] : [
          {showId: req.body.showId},
          {genreId: req.body.genreId}
        ]
      }
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully removed genre to that show!",
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