const CourseModel = require("../model/course.model")
const _ = require('lodash');
const { ObjectId } = require('mongoose').Types;
const UserServices = require("../services/user.services")

//////////////////
const AUTO_SAVE = "auto-save"
const CLICK_TO_SAVE = "click-to-save"
const CAN_ACCESS_COURSE = 1


/////////////////

const getAutoSaveCourseByUserId = async (userID) => {
    let course = await CourseModel.findOne({ owner: userID, autoSave: true })
    return course
}

const newCourseAutoSave = async (course) => {
    let newCourse = new CourseModel(course);
    await newCourse.save();
    return true;
}

const deleteAutosaveCourseByCourseID = async (courseID) => {
    let isDelete = await CourseModel.deleteOne({ _id: courseID })
    return isDelete
}

const getAllCoursesByUserID = async (userID) => {
    return await CourseModel.find({ owner: userID, autoSave: false })
}

const getCourse = async (courseID) => {
    return await CourseModel.findById(courseID)
}

const getCard = async (courseID) => {
    let object = await CourseModel.findById(courseID, { cards: 1, _id: 0 })
    return object.cards
}

const getMixCard = async (courseID) => {
    let cards = await getCard(courseID)
    let mixCards = _.shuffle(cards)
    return mixCards
}

const updateCard = async (course, dataUpdate) => {
    let { term, define, positionToUpdate } = dataUpdate
    let card = course.cards[positionToUpdate]

    card.term = term
    card.define = define
    console.log(course);

    return await course.save()
}

const getAlphabetOrderCard = async (courseID) => {
    const course = await CourseModel.aggregate([
        { $match: { _id: new ObjectId(courseID) } },
        { $unwind: "$cards" },
        { $sort: { "cards.term": 1 } },
        {
            $group: {
                _id: "$_id",
                cards: { $push: "$cards" },
                created: { $first: "$created" },
                updated: { $first: "$updated" },
                __v: { $first: "$__v" },
                description: { $first: "$description" },
            },
        },
    ]);

    return course[0].cards
}

const updateCourse = async (courseID, typeToUpdate, dataToUpdate) => {
    let course = await getCourse(courseID)

    if (typeToUpdate == AUTO_SAVE) {
        if (checkDataForAutoSaveCourse(course, dataToUpdate)) {
            await course.save()
            return true
        }
    } else if (typeToUpdate == CLICK_TO_SAVE) {
        if (checkDataForClickSaveCourse(course, dataToUpdate)) {
            await course.save()
            return true
        }
    }
    return false

}
const checkDataForAutoSaveCourse = (course, dataToUpdate) => {
    try {
        if (course.titleCourse != undefined) {
            course.titleCourse = dataToUpdate.titleCourse
        } else {
            course.titleCourse = " "
        }
        if (course.description != undefined) {
            course.description = dataToUpdate.description
        } else {
            course.description = " "
        }
        if (course.permissionView != undefined) {
            course.permissionView = dataToUpdate.permissionView
        }
        if (course.permissionEdit != undefined) {
            course.permissionEdit = dataToUpdate.permissionEdit
        }
        if (course.cards != undefined) {
            course.cards = dataToUpdate.cards
        }
        let date = new Date()
        course.updated = date

        return true
    } catch (error) {
        return false
    }
}
const checkDataForClickSaveCourse = (course, dataToUpdate) => {
    try {
        course.titleCourse = dataToUpdate.titleCourse

        course.description = dataToUpdate.description

        course.permissionView = dataToUpdate.permissionView

        course.permissionEdit = dataToUpdate.permissionEdit

        course.cards = dataToUpdate.cards

        course.autoSave = dataToUpdate.autoSave

        let date = new Date()
        course.updated = date

        return true
    } catch (error) {
        return false
    }
}

const deleteCourse = async (courseID) => {
    let isDelete = await CourseModel.deleteOne({ _id: courseID })
    return isDelete
}

const checkCanAccessCourse = async (course) => {
    if (course.permissionView == CAN_ACCESS_COURSE) {
        return true
    }
    return false
}

const setUserInfoForAllCourse = async (allCourses) => {
    try {
        for (let item of allCourses) {
            item.owner = await UserServices.getUserBasicInfo(item.owner)
        }
        return allCourses
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAutoSaveCourseByUserId,
    newCourseAutoSave,
    deleteAutosaveCourseByCourseID,
    getAllCoursesByUserID,
    getCourse,
    getCard,
    getMixCard,
    updateCard,
    getAlphabetOrderCard,
    updateCourse,
    deleteCourse,
    checkCanAccessCourse,
    setUserInfoForAllCourse,
}