const UserServices = require("../services/user.services");

const loadHomePage = async (req, res, next) => {
  try {
    res.render("home");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loadHomePage,
};
