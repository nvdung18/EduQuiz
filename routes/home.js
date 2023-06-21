var express = require("express");
var router = express.Router();
const token = require("../middleware/verify");
const homeController = require("../controller/home.controller");

/* GET home page. */
router.get("/", token.verifyToken, homeController.loadHomePage);

module.exports = router;
