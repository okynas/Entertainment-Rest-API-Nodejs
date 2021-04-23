const {authentication, isStaff} = require("../middleware");
const sequelize = require("../../db/db.config");
const Show = sequelize.Show;
const Actor = sequelize.Actor;
const ActorsInShow = sequelize.Show_has_actors;

const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();

// ==============================>>
//         ACTOR IN SHOW
// ==============================>>

router.get("/", async (req, res, next) => {

  try {
    const AiS = await ActorsInShow.findAll();

    if (!AiS || AiS.length === 0) throw "films not found"

    return res.status(200).json({
      status: 200,
      status_type: "OK",
      message: "Retrieving all actors in show ✨",
      actorsInShow: AiS
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

    if (!req.body.showId) throw "Please provide show id!";
    if (!req.body.actorId) throw "Please provide actor id!";
    if (!req.body.role) throw "Please provide role!";

    const aif = await ActorsInShow.findOne({
      where: {
        [Op.and] :[
          { showId: req.body.showId },
          { actorId: req.body.actorId },
        ]
      }
    });

    if (aif) throw "Can't add actor to film, that combination already exist!";

    const actor = await Actor.findByPk(req.body.actorId)
    const show = await Show.findByPk(req.body.showId)

    if (!actor) throw "could not fetch actor"
    if (!show) throw "could not fetch show"

    await ActorsInShow.create({
      "showId": Number(req.body.showId),
      "role": req.body.role,
      "actorId": Number(req.body.actorId),
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully added actor to show!",
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
    if (!req.body.actorId) throw "Please provide actor id!";

    const aif = await ActorsInShow.findOne({
      where: {
        [Op.and] :[
          { showId: req.body.showId },
          { actorId: req.body.actorId },
        ]
      }
    });

    if (!aif) throw "Can't add actor to show, that combination does not exist!";

    await ActorsInShow.destroy({ where :
      {
        [Op.and] : [
          {showId: req.body.showId},
          {actorId: req.body.actorId}
        ]
      }
    });

    return res.status(200).json({
      status: 201,
      status_type: "Created",
      message: "Successfully removed actor to that show!",
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