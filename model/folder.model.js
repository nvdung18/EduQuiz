var mongoose = require('mongoose')
var Joi=require("joi")
const Joigoose = require("joigoose")(mongoose, { convert: false });
const Schema = mongoose.Schema

const FolderSchema = new Schema({
    title: Joi.string(),
    description: Joi.string(),
    userID: String,
    courses: Joi.array().items(
        String
    ).default([]),
}, {
    collection: 'folder'
})

//path
FolderSchema.path('userID', Schema.Types.ObjectId)
FolderSchema.path('userID').ref('user')

FolderSchema.path('courses', Schema.Types.ObjectId)
FolderSchema.path('courses').ref('course')

const FolderModel = mongoose.model('folder', FolderSchema)

module.exports = FolderModel
// module.exports.Directory = Directory