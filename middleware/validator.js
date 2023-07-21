const UserServices = require("../services/user.services")
const Joi = require('joi');
var createError = require('http-errors')

const validateEmailExists = async (req, res, next) => {
    try {
        let email = req.body.email
        if (await UserServices.isCheckEmail(email)) {
            throw createError.NotAcceptable("Email already exists")
        }
        next()
    } catch (error) {
        next(error)
    }
}

const validateBody = (schemas) => {
    return (req, res, next) => {
        const validatorResult = schemas.validate(req.body)
        if (validatorResult.error) {
            throw createError(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value.body) req.value.body = {}
            req.value.body = validatorResult.value
            next()
        }
    }
}


const schemas = {
    loginSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
    })
}

module.exports = {
    validateEmailExists,
    validateBody,
    schemas,
}

