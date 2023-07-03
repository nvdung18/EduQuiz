const UserServices = require("../services/user.services");
const newUser = async (req, res, next) => {
  try {
    const newUser = await UserServices.createUser(req.body); //true => create ok
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

const loadRegisterPage = async (req, res, next) => {
    try {
      let token = req.cookies.x_access_token;
      if (token) {
        res.redirect("back");
      } else {
        res.render("register");
      }
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  newUser,
  loadRegisterPage
};
