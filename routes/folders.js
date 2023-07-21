var express=require("express")
var router=express.Router()
const token = require("../middleware/jwt_service");
const resLocals = require("../middleware/res_locals")
const folderController=require("../controller/folders.controller")

router.all('/*', token.verifyToken, resLocals.setLocalUserInfor)

router.route("/")
    .post(folderController.newFolder)
    .get(folderController.getAllFolders)
    

module.exports=router