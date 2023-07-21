var mongoose = require('mongoose')
const Joi = require("joi");
const Schema = mongoose.Schema

const BlackListSchema = new Schema({
    token: String,
    createdAt: { type: Date, expires: 10, default: Date.now }
},{
    collection:blacklist
})

BlackListSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 })

const BlackListModel=mongoose.model('blacklist',BlackListSchema)