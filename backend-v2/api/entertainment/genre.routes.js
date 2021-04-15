const {authentication, isStaff} = require("../middleware");
const sequelize = require("../../db/db.config");
const Genre = sequelize.Genre;

const express = require("express");
const router = express.Router();

// ==============================>>
//            GENRE
// ==============================>>

router.get("/", async (req, res, next) => {
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

router.post("/", async (req, res, next) => {
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

router.put("/", authentication, isStaff, async (req, res, next) => {
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

router.delete("/", authentication, isStaff, async (req, res, next) => {
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

module.exports = router;