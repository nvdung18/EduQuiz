const FolderModel = require("../model/folder.model")
const { ObjectId } = require('mongoose').Types;

const createFolder = async (folder) => {
    const newFolder = new FolderModel(folder)
    return await newFolder.save()
}

const getFolderById = async (folderID) => {
    try {
        return await FolderModel.findById(folderID)
    } catch (error) {
        throw error
    }
}

const getAllFoldersByUserID = async (userID) => {
    return await FolderModel.find({ userID: userID })
}

const getFolderCourses = async (folderID) => {
    try {
        return await FolderModel.findById(folderID)
            .populate({
                path: "courses",
                select: "_id titleCourse cards owner permissionView",
                populate: {
                    path: "owner",
                    select: "_id username imageProfile",
                },
            })
    } catch (error) {
        throw error
    }
}

const getCoursesNotInFolder = async (folderCourses, courseOfUser) => {
    try {
        let coursesNotInFolder = []

        let folderCoursesMap = new Map()
        folderCourses.courses.forEach(course => {
            folderCoursesMap.set(course._id.toString(), course._id.toString())
        })

        courseOfUser.forEach(course => {
            if (!folderCoursesMap.has(course._id.toString())) {
                coursesNotInFolder.push(course)
            }
        })
        return coursesNotInFolder
    } catch (error) {
        throw error
    }
}

const updateCourseToFolder = async (courseID, folderID) => {
    try {
        let folder = await getFolderById(folderID)
        let courses = folder.courses
        courses.push(new ObjectId(courseID))
        await folder.save()
    } catch (error) {
        throw error
    }
}

const deleteCourseFromFolder = async (courseID, folderID) => {
    try {
        await FolderModel.findByIdAndUpdate(folderID, {
            $pull: { courses: courseID }
        });
    } catch (error) {
        throw error
    }
}

const checkIsYourFolder = async (folderID, userID) => {
    try {
        let isYourFolder = await FolderModel.findOne({ _id: folderID, userID: userID })
        return isYourFolder
    } catch (error) {
        throw error
    }
}

module.exports = {
    createFolder,
    getFolderById,
    getAllFoldersByUserID,
    getFolderCourses,
    getCoursesNotInFolder,
    updateCourseToFolder,
    deleteCourseFromFolder,
    checkIsYourFolder,
}