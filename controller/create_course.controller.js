var createError = require('http-errors')
const CourseServices = require("../services/course.services")
const UserServices = require("../services/user.services")
const { ObjectId } = require('mongoose').Types;

const renderCreateCoursePageWithCourseAutoSave = async (req, res, next) => {
    let userID = res.get("Authorization")
    let autoSaveCourse = await CourseServices.getAutoSaveCourseByUserId(new ObjectId(userID))
    if (autoSaveCourse) {
        res.redirect('/create-course/autosave/'+autoSaveCourse._id)
    } else {
        res.render("create_course", { course: null, defaultTotalTerms: 5, isAutoSave: false })
    }
}

const renderAutoSaveCourse=async (req,res,next)=>{
    let userID = res.get("Authorization")
    let autoSaveCourse = await CourseServices.getAutoSaveCourseByUserId(new ObjectId(userID))

    let defaultTotalTerms=autoSaveCourse.cards.length
    if(defaultTotalTerms==0) defaultTotalTerms+=2
    if(defaultTotalTerms==1) defaultTotalTerms+=1

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
    if (course.titleCourse != undefined) {
        autoSaveCourse.titleCourse = course.titleCourse
    }
    if (course.description != undefined) {
        autoSaveCourse.description = course.description
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

const deleteAutosaveCourse=async (req,res,next)=>{
    let courseID=req.body._id
    console.log(courseID);
    let isDelete=CourseServices.deleteAutosaveCourseByCourseID(new ObjectId(courseID))
    res.send("Ok")
}

module.exports = {
    renderCreateCoursePageWithCourseAutoSave,
    newAutoSaveCourse,
    updateAutoSaveCourse,
    renderAutoSaveCourse,
    deleteAutosaveCourse,
}