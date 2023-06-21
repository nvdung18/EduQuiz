const UserServices = require("../services/user.services");
const newUser = async (req, res, next) => {
  try {
    const newUser = await UserServices.createUser(req.body); //true => create ok
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUser,
};
