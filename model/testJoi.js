const Mongoose = require("mongoose");
const Joi = require('joi');
const Joigoose = require("joigoose")(Mongoose, { convert: false });
Mongoose.connect('mongodb://127.0.0.1:27017/Test')
    .then(() => console.log('Connected!'));

var joiUserSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required(),
    }),
    email: Joi.string().email().required(),
    bestFriend: Joi.string().meta({
        _mongoose: { type: "ObjectId", ref: "User" },
    }),
    metaInfo: Joi.any(),
    addresses: Joi.array()
        .items({
            line1: Joi.string().required(),
            line2: Joi.string(),
        })
        .meta({ _mongoose: { _id: false, timestamps: true } }),
});

var mongooseUserSchema = new Mongoose.Schema(
    Joigoose.convert(joiUserSchema)
);
User = Mongoose.model("User", mongooseUserSchema);

var aBadUser = new User({
    name: {
        first: "Barry",
        last: "White",
    },
    email: "barry@white.com",
    metaInfo: {
        hobbies: ["cycling", "dancing", "listening to Shpongle"],
    },
});

console.log(aBadUser);
// aBadUser.save().then(() => {
//     console.log("1");
// });