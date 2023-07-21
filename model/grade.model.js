var mongoose = require('mongoose')
const Schema = mongoose.Schema
var Joi = require("joi")
var Joigoose = require("joigoose")(mongoose, { convert: false })

const joiGradeSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    userID: Joi.string().required(),
    courses: Joi.array().items(
        String
    ).default([]),
    members: Joi.array().items(
        String
    ).default([]),
})
const GradeSchema = new Schema(Joigoose.convert(joiGradeSchema), {
    collection: 'grade'
})

//path
GradeSchema.path('userID', Schema.Types.ObjectId)
GradeSchema.path('userID').ref('user')

const newCourseOptions = {
    type: [{ type: Schema.Types.ObjectId }],
    ref: 'course',
};
GradeSchema.path('courses', newCourseOptions)

const newMemberOptions = {
    type: [{ type: Schema.Types.ObjectId }],
    ref: 'user',
};
GradeSchema.path('courses', newMemberOptions)

const GradeModel = mongoose.model('grade', GradeSchema)

module.exports = GradeModel