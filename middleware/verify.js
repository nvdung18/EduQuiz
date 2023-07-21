var createError = require('http-errors')
const CourseServices = require("../services/course.services")
const UserServices = require("../services/user.services")


const verifyCourseIsYours = async (req, res, next) => {
    try {
        const { courseID } = req.params
        const userID = res.get("Authorization")
        let isYourCourse = await UserServices.checkIsYourCourse(courseID, userID)

        if (isYourCourse) {
            next();
        } else {
            verifyAccessOfCourse(req, res, next);
        }
    } catch (error) {
        next(error)
    }
}

const verifyAccessOfCourse = async (req, res, next) => {
    try {
        const { courseID } = req.params
        
        let course=await CourseServices.getCourse(courseID)
        
        let canAccess=await CourseServices.checkCanAccessCourse(course)

        if(!canAccess) throw createError.Unauthorized("Bạn không có quyền truy cập khóa học này")
        
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = {
    verifyCourseIsYours,
    verifyAccessOfCourse,
}