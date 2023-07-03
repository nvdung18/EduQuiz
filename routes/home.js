var express = require("express");
var router = express.Router();
const token = require("../middleware/jwt_service");
const homeController = require("../controller/home.controller");
const resLocals=require("../middleware/res_locals")

// middleware for all router
router.all('/', token.verifyToken, resLocals.setLocalUserInfor)

/* GET home page. */
router.get("/", homeController.loadHomePage);


// router.get("/data", token.verifyToken, (req, res) => {
//   res.render("error");
// });
// router.post("/data", token.verifyToken, (req, res) => {
//   console.log(req.body);
//   res.send("Ok")
// });
// router.post('/test', function (req, res, next) {
//   const arrTest = req.body;
//   console.log('Giá trị của input:', arrTest);

//   // Thực hiện các xử lý khác ở đây

//   // Gửi phản hồi về cho máy khách
//   res.send('Yêu cầu đã được xử lý thành công!');
// });

module.exports = router;
