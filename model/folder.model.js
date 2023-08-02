var mongoose = require('mongoose')
var Joi=require("joi")
const Joigoose = require("joigoose")(mongoose, { convert: false });
const Schema = mongoose.Schema

const joiFolderSchema = Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    userID: Joi.string(),
    courses: Joi.array().items(
        Joi.string()
    ).default([]),
})

const FolderSchema = new Schema(Joigoose.convert(joiFolderSchema), {
    collection: 'folder'
})

//path
FolderSchema.path('userID', Schema.Types.ObjectId)
FolderSchema.path('userID').ref('user')

const newFolderOptions = {
    type: [{ type: Schema.Types.ObjectId }],
    ref: 'course',
};
FolderSchema.path('courses', newFolderOptions)

const FolderModel = mongoose.model('folder', FolderSchema)

module.exports = FolderModel
// module.exports.Directory = Directory