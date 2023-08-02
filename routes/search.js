var express = require("express");
var router = express.Router();
const token = require("../middleware/jwt_service");
const resLocals = require("../middleware/res_locals")
const searchController=require("../controller/search.controller")

router.all('/', token.verifyToken, resLocals.setLocalUserInfor)

router.route("/")
    .get(searchController.getCoursesBySearch)

module.exports=router