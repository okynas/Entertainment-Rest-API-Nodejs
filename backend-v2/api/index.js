const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth/auth.routes"));
router.use("/entertainment", require("./entertainment/index"));

module.exports = router;