const {authentication, isStaff} = require("../middleware");
const sequelize = require("../../db/db.config");
const Show = sequelize.Show;
const Actor = sequelize.Actor;
const Language = sequelize.Language;
const Genre = sequelize.Genre;
const Season = sequelize.Season;
const Episode = sequelize.Episode;

const express = require("express");
const router = express.Router();

// ==============================>>
//             SHOW
// ==============================>>

router.get("/", async (req, res, next) => {
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

router.post("/", authentication, isStaff, async (req, res, next) => {
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

router.put("/", authentication, isStaff, async (req, res, next) => {
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

router.delete("/", authentication, isStaff, async (req, res, next) => {
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


module.exports = router;