const UserModel = require("../model/user.model");

const createUser = async (user) => {
  const newUser = new UserModel(user);
  await newUser.save();
  return true;
};

const checkEmailExists = async (email) => {
  let checkExists = await UserModel.findOne({ email: email });
  return checkExists;
};

const checkUserExists = async (data) => {
  let user = await UserModel.findOne({
    email: data.email,
    password: data.password,
  });
  return user;
};
module.exports = {
  createUser,
  checkEmailExists,
  checkUserExists,
};
