const CourseModel = require("../model/course.model")

const getAutoSaveCourseByUserId = async (userID) => {
    let course = await CourseModel.findOne({ owner: userID, autoSave: true })
    return course
}

const newCourseAutoSave=async (course)=>{
    let newCourse=new CourseModel(course);
    await newCourse.save();
    return true;
}

const deleteAutosaveCourseByCourseID=async (courseID)=>{
    let isDelete=await CourseModel.deleteOne({_id:courseID})
    return isDelete
}

// const updateAutoSaveCourse=async (course)

module.exports={
    getAutoSaveCourseByUserId,
    newCourseAutoSave,
    deleteAutosaveCourseByCourseID,
}