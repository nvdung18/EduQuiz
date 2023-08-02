const CourseServices = require("../services/course.services")
const UserServices = require("../services/user.services")
const CourseAccessServices = require("../services/course_accessed.services")
var createError = require('http-errors')
const _ = require('lodash');
const CAN_ACCESS_COURSE = 1
const PASSWORD_ACCESS_COURSE = 2

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
                dataFilter = coursesAccessed
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

        let isYourCourse = true
        if (req.value.isYourCourse != undefined && !req.value.isYourCourse) isYourCourse = req.value.isYourCourse

        if (!course) throw createError.NotFound()
        res.render("course", { course: course, userInfo: userInfo, isYourCourse: isYourCourse })
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
        let userID = res.get("Authorization")
        let { courseID } = req.params
        await CourseServices.deleteCourse(courseID)
        await UserServices.deleteUserCourse(courseID, userID)
        res.send("ok")
    } catch (error) {
        next(error)
    }
}

const renderPasswordPage = async (req, res, next) => {
    try {
        let { courseID } = req.params

        let baseUrl = req.baseUrl
        let username = (baseUrl.split("/"))[1]

        let course = await CourseServices.getCourse(courseID)
        let canAccess = await CourseServices.checkCanAccessCourse(course)

        if (canAccess == CAN_ACCESS_COURSE || !canAccess) {
            res.redirect("/" + username + "/courses/" + courseID + "/flash-card")
        }
        else if (canAccess == PASSWORD_ACCESS_COURSE) {
            res.render("password_page",
                {
                    username: username,
                    courseID: courseID,
                    isPassword:true
                })
        }

    } catch (error) {
        next(error)
    }
}

const renderCourseByPassword = async (req, res, next) => {
    try {
        let { courseID } = req.params
        let isPassword = req.value.isPassword

        let baseUrl = req.baseUrl
        let username = (baseUrl.split("/"))[1]

        if (isPassword) {
            let coursesAccessed=req.session.courseAccessedPassword 
            if(coursesAccessed){
                coursesAccessed.courses.push(courseID)
            }else{
                req.session.courseAccessedPassword = {
                    courses:[courseID]
                }
            }
            res.redirect(302,"/" + username + "/courses/" + courseID + "/flash-card")
        } else {
            res.render("password_page",
            {
                username: username,
                courseID: courseID,
                //isPassword now is false => show error message in password_page
                isPassword: isPassword 
            })
        }
    } catch (error) {

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
    renderPasswordPage,
    renderCourseByPassword,
}