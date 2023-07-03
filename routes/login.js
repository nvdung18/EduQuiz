var express = require("express");
var router = express.Router();
var loginController = require("../controller/login.controller");
var { validateBody, schemas } = require("../middleware/validator");

router
  .route("/")
  .get(loginController.renderLoginPage)
  .post(
    validateBody(schemas.loginSchema),
    loginController.checkUser,
    loginController.createAndSaveToken
  );

router.get("/test", (req, res, next) => {
  res.set("Authorization","aksdhjkashdjkasd")
  console.log(req.get("Authorization"));
  console.log(res.get("Authorization"));
  res.send("ok")
})

module.exports = router;
