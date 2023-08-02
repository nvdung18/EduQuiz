const CourseAccessedModel = require("../model/course_accessed.model")
const CourseServices=require("../services/course.services")
const _ = require("lodash")
const { ObjectId } = require('mongoose').Types;

const createNewMonthAccess = async (courseID, userID) => {
    try {
        const newAccessed = new CourseAccessedModel({ userID: userID, courses: [courseID] })
        await newAccessed.save()
    } catch (error) {
        throw error
    }
}

const getAccessByUserIDAndDate = async (userID) => {
    try {
        let { month, year } = getCurrentMonthAndYear()

        let coursesAccessed = await CourseAccessedModel.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: '$accessedAt' }, month] },
                    { $eq: [{ $year: '$accessedAt' }, year] }
                ]
            },
            userID: userID
        })

        return coursesAccessed[0]
    } catch (error) {
        throw error
    }
}

const updateAccessed = async (courseID, userID) => {
    let courseAccessed = await getCurrentMonthAccessedCourse(courseID, userID)

    if (courseAccessed) {
        let courses = courseAccessed.courses

        //remove current position of course in courses
        var evens = _.remove(courses, function (target) {
            return target.toString() == courseID;
        });

        // push course into the last index of courses
        courses.push(new ObjectId(courseID))
        courseAccessed.courses = courses
        await courseAccessed.save()
    } else {
        let currentMonthAccessed = await getAccessByUserIDAndDate(userID)
        let courses = currentMonthAccessed.courses
        courses.push(new ObjectId(courseID))

        currentMonthAccessed.courses = courses
        currentMonthAccessed.save()
    }

}

const getCurrentMonthAccessedCourse = async (courseID, userID) => {
    let courseAccessed = await CourseAccessedModel.find({
        userID: userID,
        courses: { $in: [courseID] }
    })
    return courseAccessed[0]
}

const getCurrentMonthAndYear = () => {
    var dateObject = new Date();
    var month = dateObject.getMonth() + 1;
    var year = dateObject.getFullYear();
    return { month, year }
}

const getAllCourseAccessed = async (userID) => {
    try {
        return await CourseAccessedModel.find({ userID: userID }).populate('courses')
    } catch (error) {
        throw error
    }
}

const getLatestAccessedByUserID = async (userID, limit) => {
    try {
        return await CourseAccessedModel.find({ userID: userID }).populate("courses").sort({ _id: -1 }).limit(limit)
    } catch (error) {
        throw error
    }
}

const getLatestCoursesInAccessed = async (access, limit) => {
    try {
        let latestCourses=[]
        if(access[0]){
            let courses=access[0].courses.reverse()
            if(courses.length<=limit) limit=courses.length
    
            for(let i=0;i<limit;i++){
                latestCourses.push(courses[i])
            }
            latestCourses=await CourseServices.setUserInfoForAllCourse(latestCourses)
            return latestCourses
        }
        return null
    } catch (error) {
        throw error
    }
}

module.exports = {
    createNewMonthAccess,
    getAccessByUserIDAndDate,
    updateAccessed,
    getAllCourseAccessed,
    getLatestAccessedByUserID,
    getLatestCoursesInAccessed,
}