const express = require("express");
const userROutes = require("./userRoutes");

const router = express.Router();
router.use("/user", userROutes);

module.exports = router;
