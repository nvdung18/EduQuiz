const CourseServices = require("../services/course.services")

const getCoursesBySearch = async (req, res, next) => {
    try {
        let { query, page,isChangePage } = req.query
        if (!page) page = 1

        if(!isChangePage) isChangePage=false

        let {courses,startGetElement,endGetElement} = await CourseServices.getCoursesBySearch(query, page)
        let totalCoursesCount = await CourseServices.countAllCoursesBySearch(query)

        if(endGetElement>totalCoursesCount) endGetElement=totalCoursesCount

        if(isChangePage){
            res.send(["ok",{courses:courses,startGetElement:startGetElement,endGetElement:endGetElement}])
        }else{
            res.render("search", { courses: courses, query: query, totalCoursesCount: totalCoursesCount,startGetElement,endGetElement })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getCoursesBySearch
}