var express = require("express")
var router = express.Router()
const token = require("../middleware/jwt_service");
const resLocals = require("../middleware/res_locals")
const verify = require("../middleware/verify")
const activityRecording = require("../middleware/activity_recording")
const courseController = require("../controller/course.controller")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
const uploadImageController = require("../controller/upload-file.controller")

router.all('/*', token.verifyToken, resLocals.setLocalUserInfor)

// for all_course
router.route("/")
    .get(courseController.getALlCourses)

router.route("/filter/:typeFilter")
    .get(courseController.getCoursesByFilter)

//// for course
router.all('/:courseID/*',
    verify.verifyCourseIsYours, 
    activityRecording.recordCourseAccessed, 
    activityRecording.recordLearningChain)

router.route("/:courseID/flash-card")
    .get(courseController.getDataCourse)

router.route("/:courseID/mix-cards")
    .get(courseController.getMixCard)

router.route("/:courseID/cards")
    .get(courseController.getCard)

router.route("/:courseID/edit-card")
    .put(courseController.updateCard)

router.route("/:courseID/alphabet-order-card")
    .get(courseController.getAlphabetOrderCard)

router.route("/:courseID/edit-course")
    .get(courseController.getDataToEditCourse)
    .put(courseController.autoSaveCourse)

router.post('/:courseID/edit-course/upload-image', upload.single("filename"), uploadImageController.uploadImgIntoFirebase)

router.route("/:courseID/edit-course/save-course")
    .put(courseController.updateCourse)

router.route("/:courseID/delete-course")
    .delete(courseController.deleteCourse)

module.exports = router