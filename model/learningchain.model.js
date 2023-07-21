var mongoose = require('mongoose')
const Joi = require("joi");
const Joigoose = require("joigoose")(mongoose, { convert: false });
const Schema = mongoose.Schema

const joiLearningChainSchema = Joi.object().keys({
    userID: Joi.string().required(),
    month_year:Joi.date().default(Date.now),
    learnedDays: Joi.array().items(
        Joi.date().default(Date.now)
    ).default([])
})
const LearningChainSchema = new Schema(Joigoose.convert(joiLearningChainSchema), {
    collection: 'learningchain'
})

const LearningChainModel = mongoose.model('learningchain', LearningChainSchema)

module.exports = LearningChainModel