var mongoose = require("mongoose");
const Joi = require("joi");
const Joigoose = require("joigoose")(mongoose, { convert: false });
const Schema = mongoose.Schema;

const joiUserSchema = Joi.object({
  imageProfile: Joi.string().default(" "),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
  loginType: Joi.string().default("EduQuiz"),
  username: Joi.string().required(),
  userToken: Joi.string().default(" "),
  role: Joi.number().integer().default(1),
});

var UserSchema = new Schema(Joigoose.convert(joiUserSchema), {
  collection: "user",
});

const UserModel = mongoose.model("user", UserSchema);

// class User {
//     constructor(idUser, imageProfile, accountName, password, method, email, username, userToken, role) {
//         this.idUser = idUser
//         this.imageProfile = imageProfile
//         this.accountName = accountName
//         this.password = password
//         this.method = method
//         this.email = email
//         this.username = username
//         this.userToken = userToken
//         this.role = role
//     }
// }

module.exports = UserModel;
