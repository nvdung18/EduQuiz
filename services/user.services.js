const UserModel = require("../model/user.model");
const CourseModel = require("../model/course.model");

const createUser = async (user) => {
  const newUser = new UserModel(user);
  await newUser.save();
  return true;
};

const isCheckEmail = async (email) => {
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

const getUserByID = async (userID) => {
  let user = await UserModel.findById(userID)
  return user
}

const updateCourseUserByID = async (course, user) => {
  user.course.push(course._id)
  let isUpdated = await user.updateOne({ course: user.course })
  return isUpdated
}

const getUserCourses = async (userID) => {
  return await UserModel.findById(userID).populate('course')
}

const checkIsYourCourse = async (courseID, userID) => {
  try {
    let isYourCourse = await UserModel.findOne({ _id: userID, course: courseID })
    return isYourCourse
  } catch (error) {
    throw error
  }
}

const getUserBasicInfo=async(userID)=>{
  try {
    return await UserModel.findById(userID).select("_id username imageProfile")
  } catch (error) {
    throw error
  }
}

module.exports = {
  createUser,
  isCheckEmail,
  checkUserExists,
  getUserByID,
  updateCourseUserByID,
  getUserCourses,
  checkIsYourCourse,
  getUserBasicInfo,
};
