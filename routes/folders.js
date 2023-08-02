var express=require("express")
var router=express.Router()
const token = require("../middleware/jwt_service");
const resLocals = require("../middleware/res_locals")
const folderController=require("../controller/folders.controller")
const verify=require("../middleware/verify")

router.all('/*', token.verifyToken, resLocals.setLocalUserInfor)

router.route("/")
    .post(folderController.newFolder)
    .get(folderController.getAllFolders)

router.route("/:folderID/courses")
    .get(verify.verifyFolderIsYous,folderController.getFolder)

router.route("/:folderID/courses/:courseID")
    .put(folderController.updateCourseToFolder)
    .delete(folderController.deleteCourseFromFolder)
    
module.exports=router