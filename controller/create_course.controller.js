var createError = require('http-errors')
const CourseServices = require("../services/course.services")
const UserServices = require("../services/user.services")
const { ObjectId } = require('mongoose').Types;

const renderCreateCoursePageWithCourseAutoSave = async (req, res, next) => {
    let userID = res.get("Authorization")
    let autoSaveCourse = await CourseServices.getAutoSaveCourseByUserId(new ObjectId(userID))
    if (autoSaveCourse) {
        res.redirect('/create-course/autosave/' + autoSaveCourse._id)
    } else {
        res.render("create_course", { course: null, defaultTotalTerms: 5, isAutoSave: false })
    }
}

const renderAutoSaveCourse = async (req, res, next) => {
    let userID = res.get("Authorization")
    let autoSaveCourse = await CourseServices.getAutoSaveCourseByUserId(new ObjectId(userID))

    let defaultTotalTerms = autoSaveCourse.cards.length
    if (defaultTotalTerms == 0) defaultTotalTerms += 2
    if (defaultTotalTerms == 1) defaultTotalTerms += 1

    res.render("create_course", { course: autoSaveCourse, defaultTotalTerms: defaultTotalTerms, isAutoSave: autoSaveCourse.autoSave })
}

const newAutoSaveCourse = async (req, res, next) => {
    const course = req.body

    let user = await UserServices.getUserByID(res.get("Authorization"))
    course.owner = user

    let result = CourseServices.newCourseAutoSave(course)
    res.send("Khoa hoc da tu dong luu")

}

const updateAutoSaveCourse = async (req, res, next) => {
    let userID = res.get("Authorization")
    let autoSaveCourse = await CourseServices.getAutoSaveCourseByUserId(new ObjectId(userID))

    const course = req.body
    console.log(course);
    if (course.titleCourse != undefined) {
        autoSaveCourse.titleCourse = course.titleCourse
    } else {
        autoSaveCourse.titleCourse = " "
    }
    if (course.description != undefined) {
        autoSaveCourse.description = course.description
    } else {
        autoSaveCourse.description = " "
    }
    if (course.permissionView != undefined) {
        autoSaveCourse.permissionView = course.permissionView
    }
    if (course.permissionEdit != undefined) {
        autoSaveCourse.permissionEdit = course.permissionEdit
    }
    if (course.cards != undefined) {
        autoSaveCourse.cards = course.cards
    }
    let date = new Date()
    autoSaveCourse.updated = date

    await autoSaveCourse.save()

    // var dateObject = new Date(date);
    // var day = dateObject.getDate();
    // var month = dateObject.getMonth() + 1;
    // var year = dateObject.getFullYear();
    // var time=dateObject.getTime()
    // var formattedDate = day+"/"+month+"/"+year;
    // console.log(formattedDate);
    // console.log(time);
    res.send("Cap nhap thanh cong")

}

const deleteAutosaveCourse = async (req, res, next) => {
    let courseID = req.body._id
    console.log(courseID);
    let isDelete = CourseServices.deleteAutosaveCourseByCourseID(new ObjectId(courseID))
    res.send("Ok")
}

const updateAutoSaveToOfficialCourse = async (req, res, next) => {
    let userID = res.get("Authorization")
    let autoSaveCourse = await CourseServices.getAutoSaveCourseByUserId(new ObjectId(userID))
    const course = req.body

    autoSaveCourse.titleCourse = course.titleCourse

    autoSaveCourse.description = course.description

    autoSaveCourse.permissionView = course.permissionView

    autoSaveCourse.permissionEdit = course.permissionEdit

    autoSaveCourse.cards = course.cards

    autoSaveCourse.autoSave = course.autoSave

    let date = new Date()
    autoSaveCourse.created = date
    autoSaveCourse.updated = date

    await autoSaveCourse.save()

    if(!req.value) req.value={}
    if(!req.value.course) req.value.course={}
    req.value.course=autoSaveCourse

    next()
}

const updateCourseForUser=async (req,res)=>{
    let user = await UserServices.getUserByID(res.get("Authorization"))
    let course=req.value.course
    
    let isUpdatedUser=UserServices.updateCourseUserByID(course,user)
    res.send("Cap nhap thanh cong")
}

module.exports = {
    renderCreateCoursePageWithCourseAutoSave,
    newAutoSaveCourse,
    updateAutoSaveCourse,
    renderAutoSaveCourse,
    deleteAutosaveCourse,
    updateAutoSaveToOfficialCourse,
    updateCourseForUser,
}