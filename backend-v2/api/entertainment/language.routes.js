const {authentication, isStaff} = require("../middleware");
const sequelize = require("../../db/db.config");
const Language = sequelize.Language;

const express = require("express");
const router = express.Router();


// ==============================>>
//           LANGUAGES
// ==============================>>

router.get("/", async (req, res, next) => {
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

router.post("/", async (req, res, next) => {
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

router.put("/", authentication, isStaff, async (req, res, next) => {
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

router.delete("/", authentication, isStaff, async (req, res, next) => {
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

module.exports = router;