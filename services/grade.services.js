const GradeModel = require("../model/grade.model")

const createGrade = async (grade) => {
    let newGrade = new GradeModel(grade)
    return await newGrade.save()
}

const getAllClassesByUserID = async (userID) => {
    return await GradeModel.find({userID:userID})

}

module.exports = {
    createGrade,
    getAllClassesByUserID,
}