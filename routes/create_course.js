var express = require("express");
var router = express.Router();
const token = require("../middleware/jwt_service");
const multer = require("multer")
const CourseModel = require("../model/course.model")
const UserModel = require("../model/user.model")
const resLocals = require("../middleware/res_locals")
const createCourseController = require("../controller/create_course.controller")
const uploadImageController=require("../controller/upload-file.controller")

const upload = multer({ storage: multer.memoryStorage() })

router.all('/*', token.verifyToken, resLocals.setLocalUserInfor)

router.route("/")
    .get(createCourseController.renderCreateCoursePageWithCourseAutoSave)


router.route("/autosave")
    .post(createCourseController.newAutoSaveCourse)
    .put(createCourseController.updateAutoSaveCourse)
    .delete(createCourseController.deleteAutosaveCourse)
    
router.post('/upload-image',upload.single("filename"),uploadImageController.uploadImgIntoFirebase)

router.route("/autosave/:id")
    .get(createCourseController.renderAutoSaveCourse)




//router test------------------
router.post("/abc", (req, res, next) => {
    const arrTest = req.body;
    console.log('Giá trị của input:', arrTest.titleCourse);

    // Thực hiện các xử lý khác ở đây

    // Gửi phản hồi về cho máy khách
    res.send('Yêu cầu đã được xử lý thành công!');

})
router.get("/test", async (req, res, next) => {
    const userID = "64957cba2b83dfb1115744df"
    //new course
    let course = new CourseModel(req.body)

    // get user
    const user = await UserModel.findById(userID)
    // console.log(user);
    course.owner = user
    // await course.save()
    console.log("course.owner ", course);

    // user.course.push(course._id)
    // console.log("user course: ",user.course);
    // await user.updateOne({course:user.course})

    res.status(201).json({ newCourse: course })

})

module.exports = router