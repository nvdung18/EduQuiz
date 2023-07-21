var mongoose = require('mongoose')
const Joi = require("joi");
const Joigoose = require("joigoose")(mongoose, { convert: false });
const Schema = mongoose.Schema

const joiCourseAccessedSchema = Joi.object().keys({
    accessedAt: Joi.date().default(Date.now),
    userID: Joi.string().required(),
    courses: Joi.array().items(
        Joi.string()
    ).default([])
})
const CourseAccessedSchema = new Schema(Joigoose.convert(joiCourseAccessedSchema), {
    collection: 'course_accessed'
})

//path
CourseAccessedSchema.path('userID', Schema.Types.ObjectId)
CourseAccessedSchema.path('userID').ref('user')

const newCourseOptions = {
    type: [{ type: Schema.Types.ObjectId }],
    ref: 'course',
};
CourseAccessedSchema.path('courses', newCourseOptions)

//
const CourseAccessedModel = mongoose.model('course_accessed', CourseAccessedSchema)

module.exports = CourseAccessedModel