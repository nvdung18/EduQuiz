var createError = require('http-errors')
const FolderServices = require("../services/folder.services")
const CourseServices = require("../services/course.services")
const NUM_OF_COLUMNS=2

const newFolder = async (req, res, next) => {
    try {
        let { titleFolder, descriptionFolder } = req.body
        let userID = res.get("Authorization")
        let folder = {
            title: titleFolder,
            description: descriptionFolder,
            userID: userID
        }

        let isSuccess = await FolderServices.createFolder(folder)
        if (!isSuccess) throw createError.InternalServerError()

        res.redirect('back')
    } catch (error) {
        next(error)
    }
}

const getAllFolders = async (req, res, next) => {
    try {
        let userID = res.get("Authorization")
        const allFolders = await FolderServices.getAllFoldersByUserID(userID)

        if (!allFolders) throw createError.InternalServerError()

        res.status(200).render("all_folder", { allFolders: allFolders })
    } catch (error) {
        next(error)
    }
}

const getFolder = async (req, res, next) => {
    try {
        let userID = res.get("Authorization")
        let { folderID } = req.params
        let isYourFolder=req.value.isYourFolder

        let folderCourses = await FolderServices.getFolderCourses(folderID)

        let numberOfRows = Math.ceil(folderCourses.courses.length / NUM_OF_COLUMNS);

        if(isYourFolder){
            let coursesOfUser = await CourseServices.getAllCoursesByUserID(userID)

            let coursesNotInFolder = await FolderServices.getCoursesNotInFolder(folderCourses, coursesOfUser)
    
            res.status(200).render("folder", { folderCourses: folderCourses, coursesNotInFolder: coursesNotInFolder, numberOfRows: numberOfRows,isYourFolder:isYourFolder })
        }else{
            res.status(200).render("folder", { folderCourses: folderCourses, numberOfRows: numberOfRows,isYourFolder:isYourFolder })
        }
    } catch (error) {
        next(error)
    }
}

const updateCourseToFolder = async (req, res, next) => {
    try {
        let { courseID, folderID } = req.params

        await FolderServices.updateCourseToFolder(courseID, folderID)

        let courses = await FolderServices.getFolderCourses(folderID)

        res.send(["Update successful", courses])
    } catch (error) {
        next(error)
    }
}

const deleteCourseFromFolder = async (req, res, next) => {
    try {
        let { courseID, folderID } = req.params

        await FolderServices.deleteCourseFromFolder(courseID, folderID)

        let courses = await FolderServices.getFolderCourses(folderID)

        res.send(["Delete successful", courses])
    } catch (error) {
        next(error)
    }
}

module.exports = {
    newFolder,
    getAllFolders,
    getFolder,
    updateCourseToFolder,
    deleteCourseFromFolder
}