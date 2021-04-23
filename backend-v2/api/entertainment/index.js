const express = require("express");
const router = express.Router();

router.use("/actorsinfilms", require("./actorInFilm.routes"))
router.use("/actorsinshow", require("./actorInShow.routes"))
router.use("/genreinfilms", require("./genreInFilm.routes"))
router.use("/genreinshows", require("./genreInShow.routes"))
router.use("/episodes", require("./episode.routes"));
router.use("/season", require("./season.routes"));
router.use("/film", require("./film.routes"));
router.use("/show", require("./show.routes"));
router.use("/genre", require("./genre.routes"));
router.use("/actors", require("./actor.routes"));
router.use("/language", require("./language.routes"));

module.exports = router;