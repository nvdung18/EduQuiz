var express = require("express");
var router = express.Router();
var loginController = require("../controller/login.controller");
var { validateBody, schemas } = require("../middleware/validator");
const verify = require("../middleware/verify");

router
  .route("/")
  .get(loginController.loadLoginPage)
  .post(
    validateBody(schemas.loginSchema),
    loginController.checkUser,
    loginController.createAndSaveToken
  );

module.exports = router;
