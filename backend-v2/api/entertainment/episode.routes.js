const {authentication, isStaff, findEpisode} = require("../middleware");

const express = require("express");
const router = express.Router();

const sequelize = require("../../db/db.config");


const Episode = sequelize.Episode;
// const ActorsInShow = sequelize.Show_has_actors;
// const Film_has_genre = sequelize.Film_has_genre;
// const GenreInShow = sequelize.Show_has_genre;



// ==============================>>
//            EPISODE
// ==============================>>

router.get("/", async (req, res, next) => {
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

router.post("/", authentication, isStaff, async (req, res, next) => {
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

router.put("/", authentication, isStaff, async (req, res, next) => {
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

router.delete("/", authentication, isStaff, async (req, res, next) => {
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