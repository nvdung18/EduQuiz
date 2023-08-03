var createError = require('http-errors')
const CourseServices = require("../services/course.services")
const UserServices = require("../services/user.services")
const CourseAccessedServices = require("../services/course_accessed.services")
const LearningChainServices=require("../services/learning_chain.services")

const recordCourseAccessed = async (req, res, next) => {
    try {
        const { courseID } = req.params
        const userID = res.get("Authorization")

        let accessedCurrentMonth = await CourseAccessedServices.getAccessByUserIDAndDate(userID)
        
        if (accessedCurrentMonth) {
            await CourseAccessedServices.updateAccessed(courseID, userID)
        } else {
            await CourseAccessedServices.createNewMonthAccess(courseID, userID)
        }

        next()
    } catch (error) {
        next(error)
    }
}

const recordLearningChain = async (req, res, next) => {
    try {
        const userID = res.get("Authorization")
        let isLatestLearningChain=await LearningChainServices.getLatestLearningChain(userID)

        if(isLatestLearningChain){
            let isExistCurrentDate=await LearningChainServices.getNowDateInLearningChain(userID)
            if(!isExistCurrentDate){
                await LearningChainServices.newDayInLearningChain(userID)
            }
        }else{
            await LearningChainServices.newMonthLearningChain(userID)
        }
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = {
    recordCourseAccessed,
    recordLearningChain,
}