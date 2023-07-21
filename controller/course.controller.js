const CourseServices = require("../services/course.services")
const UserServices = require("../services/user.services")
const CourseAccessServices = require("../services/course_accessed.services")
var createError = require('http-errors')
const _ = require('lodash');

///////////
const BE_CREATED = "created"
const ACCESSED = "accessed"

///////////

const getALlCourses = async (req, res, next) => {
    try {
        let userID = res.get("Authorization")
        let user = await UserServices.getUserCourses(userID)

        if (!user) throw createError.InternalServerError()

        let courses = user.course

        let allCourses = courses
        allCourses = await CourseServices.setUserInfoForAllCourse(allCourses)

        res.status(200).render("all_course", { allCourses: allCourses })
    } catch (error) {
        next(error)
    }
}

const getCoursesByFilter = async (req, res, next) => {
    try {
        let { typeFilter } = req.params
        let userID = res.get("Authorization")

        let dataFilter = []

        if (typeFilter == ACCESSED) {
            let coursesAccessed = await CourseAccessServices.getAllCourseAccessed(userID)
            if (coursesAccessed) {
                for (let item of coursesAccessed) {
                    let allCourses = item.courses
                    allCourses = await CourseServices.setUserInfoForAllCourse(allCourses)
                }
                console.log(coursesAccessed[0].courses[0].owner)
                dataFilter=coursesAccessed
            }
        } else if (typeFilter == BE_CREATED) {
            let userCourses = await UserServices.getUserCourses(userID)
            if (userCourses) {
                dataFilter = userCourses.course
                dataFilter = await CourseServices.setUserInfoForAllCourse(dataFilter)
            }
        }
        res.send(["Get data successful", { dataFilter: dataFilter }])
    } catch (error) {
        next(error)
    }
}

const getDataCourse = async (req, res, next) => {
    try {
        let { courseID } = req.params
        let course = await CourseServices.getCourse(courseID)

        let owner = await UserServices.getUserByID(course.owner)
        let userInfo = {
            imageProfile: owner.imageProfile,
            username: owner.username
        }

        if (!course) throw createError.NotFound()
        res.render("course", { course: course, userInfo: userInfo })
    } catch (error) {
        next(error)
    }
}

const getMixCard = async (req, res, next) => {
    try {
        let { courseID } = req.params
        let mixCards = await CourseServices.getMixCard(courseID)

        res.send(["Get data success", { "mixCards": mixCards }])
    } catch (error) {
        next(error)
    }
}

const getCard = async (req, res, next) => {
    try {
        let { courseID } = req.params
        let cards = await CourseServices.getCard(courseID)

        res.send(["Get data success", { "cards": cards }])
    } catch (error) {
        next(error)
    }
}

const updateCard = async (req, res, next) => {
    try {
        let { courseID } = req.params
        let dataToUpdate = req.body

        let course = await CourseServices.getCourse(courseID)

        let isUpdate = await CourseServices.updateCard(course, dataToUpdate)

        if (!isUpdate) throw createError.InternalServerError()
        res.send("Update successful")
    } catch (error) {

    }
}

const getAlphabetOrderCard = async (req, res, next) => {
    try {
        let { courseID } = req.params

        let cardOrder = await CourseServices.getAlphabetOrderCard(courseID)

        if (!cardOrder) throw createError.InternalServerError()

        res.send(["Get order successful", { "cardOrder": cardOrder }])
    } catch (error) {
        next(error)
    }
}

const getDataToEditCourse = async (req, res, next) => {
    try {
        let { courseID } = req.params
        let course = await CourseServices.getCourse(courseID)
        // console.log(course);
        if (!course) throw createError.BadRequest()

        res.render("edit_course", { course: course })
    } catch (error) {
        next(error)
    }
}

const autoSaveCourse = async (req, res, next) => {
    try {
        let { courseID } = req.params
        const dataToUpdate = req.body

        let isUpdate = await CourseServices.updateCourse(courseID, "auto-save", dataToUpdate)

        if (!isUpdate) createError.BadRequest()
        // var dateObject = new Date(date);
        // var day = dateObject.getDate();
        // var month = dateObject.getMonth() + 1;
        // var year = dateObject.getFullYear();
        // var time=dateObject.getTime()
        // var formattedDate = day+"/"+month+"/"+year;
        // console.log(formattedDate);
        // console.log(time);
        res.send("Cap nhap thanh cong")
    } catch (error) {
        next(error)
    }
}

const updateCourse = async (req, res, next) => {
    try {
        let { courseID } = req.params
        const dataToUpdate = req.body

        let isUpdate = await CourseServices.updateCourse(courseID, "click-to-save", dataToUpdate)

        if (!isUpdate) createError.BadRequest()
        res.send("Luu thanh cong")
    } catch (error) {
        next(error)
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        let { courseID } = req.params
        let isDelete = CourseServices.deleteCourse(courseID)

        if (!isDelete) throw createError.BadRequest()
        res.send("ok")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getALlCourses,
    getCoursesByFilter,
    getDataCourse,
    getMixCard,
    getCard,
    updateCard,
    getAlphabetOrderCard,
    getDataToEditCourse,
    autoSaveCourse,
    updateCourse,
    deleteCourse,
}