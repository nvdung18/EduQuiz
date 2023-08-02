var express = require("express");
var router = express.Router();
const token = require("../middleware/jwt_service");
const resLocals=require("../middleware/res_locals")
const homeController = require("../controller/home.controller");

// middleware for all router
router.all('/', token.verifyToken, resLocals.setLocalUserInfor)

/* GET home page. */
router.get("/", homeController.loadHomePage);


module.exports = router;
