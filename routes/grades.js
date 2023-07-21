var express = require("express")
var router = express.Router()
const token = require("../middleware/jwt_service");
const resLocals = require("../middleware/res_locals")
const gradeController=require("../controller/grades.controller")

router.all('/*', token.verifyToken, resLocals.setLocalUserInfor)

router.route("/")
    .post(gradeController.newGrade)
    .get(gradeController.getAllClasses)

module.exports = router