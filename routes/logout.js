var express = require("express");
var router = express.Router();
const token = require("../middleware/jwt_service");
const resLocals = require("../middleware/res_locals")
router.all('/*', token.verifyToken, resLocals.setLocalUserInfor)

router.route('/')
    .delete((req,res,next)=>{
        res.clearCookie('x_access_token');
        res.send("ok")
        // res.redirect("/login")
    })

module.exports=router