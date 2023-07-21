var mongoose = require("mongoose");
const Joi = require("joi");
const Joigoose = require("joigoose")(mongoose, { convert: false });
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema;
Joi.objectId = require("joi-objectid")(Joi);

const joiUserSchema = Joi.object({
  imageProfile: Joi.string().default(" "),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
  loginType: Joi.string().default("EduQuiz"),
  username: Joi.string().required(),
  userToken: Joi.string().default(" "),
  role: Joi.number().integer().default(1),
  course:Joi.array().items(
    Joi.objectId()
  ).default([])
});

var UserSchema = new Schema(Joigoose.convert(joiUserSchema), {
  collection: "user",
});

const newCourseOptions = {
  type: [{ type: Schema.Types.ObjectId }],
  ref: 'course',
};
UserSchema.path('course',newCourseOptions)
// UserSchema.path('course').ref('courses')

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    next(error)
  }
}

const UserModel = mongoose.model("user", UserSchema);


module.exports = UserModel;
