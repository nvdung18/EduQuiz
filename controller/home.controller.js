const UserServices = require("../services/user.services");
const CourseAccessed = require("../services/course_accessed.services")
const CourseServices = require("../services/course.services")
const LearningChainServices=require("../services/learning_chain.services")

const loadHomePage = async (req, res, next) => {
  try {
    const [LIMIT_BE_CREATED, LIMIT_RECENT] = [3, 3];
    let userID = res.get("Authorization")
    let latestCoursesBeCreated = await CourseServices.getLatestCourseByUserID(userID, LIMIT_BE_CREATED)

    let latestAccessed = await CourseAccessed.getLatestAccessedByUserID(userID, 1)
    let latestCoursesAccessed=await CourseAccessed.getLatestCoursesInAccessed(latestAccessed,LIMIT_RECENT)

    let weekDays=await LearningChainServices.getWeekDays()
    let learningChain=await LearningChainServices.getLearningChainOfWeek(weekDays,userID)

    res.render("home", { latestCoursesBeCreated: latestCoursesBeCreated, latestCoursesAccessed, latestCoursesAccessed,learningChain:learningChain });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loadHomePage,
};
