var createError = require('http-errors')
const CourseServices = require("../services/course.services")
const UserServices = require("../services/user.services")
const FolderServices=require("../services/folder.services")
const CAN_ACCESS_COURSE = 1
const PASSWORD_ACCESS_COURSE = 2


const verifyCourseIsYours = async (req, res, next) => {
    try {
        const { courseID } = req.params
        const userID = res.get("Authorization")


        if (!req.value) req.value = {}
        if (!req.value.isYourCourse) req.value.isYourCourse = {}

        let isYourCourse = await UserServices.checkIsYourCourse(courseID, userID)
        if (isYourCourse) {
            req.value.isYourCourse = true
            next();
        } else {
            req.value.isYourCourse = false
            verifyAccessOfCourse(req, res, next);
        }
    } catch (error) {
        next(error)
    }
}

const verifyAccessOfCourse = async (req, res, next) => {
    try {
        await checkAccessToPathNotAllowed(req, res, next)

        const { courseID } = req.params

        const coursesAccessed = req.session.courseAccessedPassword
        let isCourseAccessed = false

        let course = await CourseServices.getCourse(courseID)

        let canAccess = await CourseServices.checkCanAccessCourse(course)
        if (canAccess == PASSWORD_ACCESS_COURSE) {
            isCourseAccessed = isCourseAccessedByPassword(coursesAccessed, courseID)

            if (!isCourseAccessed) {
                redirectToPasswordPage(req, res, courseID)
            } else if (isCourseAccessed) next()

        } else if (canAccess == CAN_ACCESS_COURSE) next()

        if (!canAccess) throw createError.Unauthorized("Bạn không có quyền truy cập khóa học này")
    } catch (error) {
        next(error)
    }
}

const checkAccessToPathNotAllowed = async (req, res, next) => {
    let pathNotAllowed = ["edit-card", "edit-course", "save-course", "delete-course"]
    let paths = req.path.split("/")
    paths.forEach(path => {
        if (pathNotAllowed.includes(path)) throw createError.Unauthorized("Bạn không có quyền truy cập vào đường dẫn này")
    })
}

const verifyPasswordCourse = async (req, res, next) => {
    try {
        let { input_password } = req.body
        let { courseID } = req.params
        let isPassword = await CourseServices.checkPasswordCourse(courseID, input_password)

        if (!req.value) req.value = {}
        if (!req.value.isPassword) req.value.isPassword = {}

        if (!isPassword) {
            req.value.isPassword = false
        } else {
            req.value.isPassword = true
        }
        next()
    } catch (error) {
        next(error)
    }
}

const isCourseAccessedByPassword = (coursesAccessed, courseID) => {
    if (coursesAccessed != undefined) {
        let courses = coursesAccessed.courses
        for (let i = 0; i < courses.length; i++) {
            if (courseID == courses[i]) return true
        }
    }
    return false
}

const redirectToPasswordPage = (req, res, courseID) => {
    let baseUrl = req.baseUrl
    let username = (baseUrl.split("/"))[1]
    res.redirect("/" + username + "/courses/" + courseID + "/password")
}

const verifyFolderIsYous = async (req,res,next) => {
    try {
        const {folderID}=req.params
        const userID = res.get("Authorization")


        if (!req.value) req.value = {}
        if (!req.value.isYourFolder) req.value.isYourFolder = {}

        let isYourFolder = await FolderServices.checkIsYourFolder(folderID, userID)
        if (isYourFolder) {
            req.value.isYourFolder = true
        } else {
            req.value.isYourFolder = false
        }
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = {
    verifyCourseIsYours,
    verifyAccessOfCourse,
    verifyPasswordCourse,
    verifyFolderIsYous,
}