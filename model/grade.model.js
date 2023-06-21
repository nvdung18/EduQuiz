var mongoose = require('mongoose')
const Schema = mongoose.Schema
var a = require("../configs/db.config")

const GradeSchema = new Schema({
    nameGrade: String,
    Description: String,
    idUser: String,
    Courses: Object,
    Members: Object
}, {
    collection: 'grade'
})

const GradeModel = mongoose.model('grade', GradeSchema)

// class Grade {
//     constructor(idGrade, nameGrade, Description, idUser, Courses, Members) {
//         this.idGrade = idGrade
//         this.nameGrade = nameGrade
//         this.Description = Description
//         this.idUser = idUser
//         this.Courses = Courses
//         this.Members = Members
//     }
// }

module.exports = {
    GradeModel
}