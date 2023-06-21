var mongoose = require('mongoose')
const Schema = mongoose.Schema

const DirectorySchema = new Schema({
    titleDirectory: String,
    Description: String,
    idUser: String,
    Course: Object,
}, {
    collection: 'directory'
})

const DirectoryModel = mongoose.model('directory', DirectorySchema)

// class Directory {
//     constructor(idDirectory, titleDirectory, Description, idUser, Course) {
//         this.idDirectory = idDirectory
//         this.titleDirectory = titleDirectory
//         this.Description = Description
//         this.idUser = idUser
//         this.Course = Course
//     }
// }

module.exports = {
    DirectoryModel
}
// module.exports.Directory = Directory