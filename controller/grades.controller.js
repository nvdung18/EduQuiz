var GradeServices = require("../services/grade.services")

const newGrade = async (req, res, next) => {
    try {
        let { nameClass, descriptionCLass } = req.body
        let userID = res.get("Authorization")
        let grade = {
            name: nameClass,
            description: descriptionCLass,
            userID: userID
        }

        let isSuccess = await GradeServices.createGrade(grade)
        if (!isSuccess) throw createError.InternalServerError()

        res.redirect('back')
    } catch (error) {
        next(error)
    }
}

const getAllClasses = async (req, res, next) => {
    try {
        let userID = res.get("Authorization")
        const allClasses = await GradeServices.getAllClassesByUserID(userID)

        if (!allClasses) throw createError.InternalServerError()

        res.status(200).render("all_class",{allClasses})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    newGrade,
    getAllClasses,
}