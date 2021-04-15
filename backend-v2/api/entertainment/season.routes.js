const {authentication, isStaff} = require("../middleware");
const sequelize = require("../../db/db.config");
const Season = sequelize.Season;
const Episode = sequelize.Episode;

const express = require("express");
const router = express.Router();

// ==============================>>
//            SEASON
// ==============================>>

router.get("/", async (req, res, next) => {
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

router.post("/", authentication, isStaff, async (req, res, next) => {
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

router.put("/", authentication, isStaff, async (req, res, next) => {
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

router.delete("/", authentication, isStaff, async (req, res, next) => {
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

module.exports = router;