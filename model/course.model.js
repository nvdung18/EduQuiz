var mongoose = require('mongoose')
const Joi = require("joi");
const Joigoose = require("joigoose")(mongoose, { convert: false });
const Schema = mongoose.Schema
// const objectId = require("joi-objectid")(Joi);
Joi.objectId = require('joi-objectid')(Joi);

const joiCourseSchema = Joi.object().keys({
    titleCourse: Joi.string(),
    description: Joi.string(),
    permissionView: Joi.number().integer().default(0), //0 is only me, 1 is everyone
    permissionEdit: Joi.number().integer().default(0),
    cards: Joi.array().items(
        Joi.object({
            term: Joi.string(),
            define: Joi.string(),
            image: Joi.string(),
            position: Joi.number()
        })
    ),
    created: Joi.date().default(Date.now),
    updated: Joi.date().default(Date.now),
    owner: Joi.objectId().required(),
    autoSave: Joi.boolean().default(true)
});

var CourseSchema = new Schema(Joigoose.convert(joiCourseSchema), {
    collection: "course"
})

//path
CourseSchema.path('owner', Schema.Types.ObjectId)
CourseSchema.path('owner').ref('user')

// const userEditOption = {
//     type: [{ type: Schema.Types.ObjectId }],
//     ref: 'user',
// };
// CourseSchema.path('permissionEdit.userEdit', userEditOption)
//model
const CourseModel = mongoose.model('course', CourseSchema);

// console.log(CourseSchema);
module.exports = CourseModel;
// module.exports.Course = Course