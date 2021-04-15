const {authentication, isStaff, splitPersonName, FindOneActor} = require("../middleware");
const sequelize = require("../../db/db.config");
const Actor = sequelize.Actor;

const express = require("express");
const router = express.Router();

// ==============================>>
//            ACTORS
// ==============================>>

router.get("/", async (req, res, next) => {

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

router.get("/:name", async (req, res, next) => {

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

router.post("/", authentication, async (req, res, next) => {
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

router.put("/", authentication, isStaff, async (req, res, next) => {
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

  router.delete("/", authentication, isStaff, async (req, res, next) => {

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

module.exports = router;