var mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
    titleCourse: String,
    Description: String,
    permissionView: Number,
    permissionEdit: Number,
    Cards: Object,
    idUser: String,
}, {
    collection: 'course'
})

const CourseModel = mongoose.model('course', CourseSchema)

// class Course {
//     constructor(idCourse, titleCourse, Description, permissionView, permissionEdit, Cards, idUser) {
//         this.idCourse = idCourse
//         this.titleCourse = titleCourse
//         this.Description = Description
//         this.permissionView = permissionView
//         this.permissionEdit = permissionEdit
//         this.idUser = idUser
//         this.Cards = Cards
//     }
// }

module.exports = {
    CourseModel
}
// module.exports.Course = Course