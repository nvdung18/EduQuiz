var express = require("express");
var router = express.Router();
const token = require("../middleware/jwt_service");
const resLocals=require("../middleware/res_locals")
const profileController=require("../controller/profile.controller")

// middleware for all router
router.all('/*', token.verifyToken, resLocals.setLocalUserInfor)

/* GET home page. */
router.get("/", profileController.getProfileUser);
router.get("/learning-chain",profileController.getLearningChainOfMonth)


module.exports = router;
