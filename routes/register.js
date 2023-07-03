var express = require('express');
var router = express.Router();
var registerController = require("../controller/register.controller")
var validator = require("../middleware/validator")


router.route('/')
  .get(registerController.loadRegisterPage)
  .post(validator.validateEmailExists,registerController.newUser)
  // .post((req, res, next) => {
  //   console.log(req.body.registerEmail);
  //   next()
  // }, registerController.newUser)


module.exports = router;