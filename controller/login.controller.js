const UserServices = require("../services/user.services");
const UserModel = require("../model/user.model")
const jwt_service = require("../middleware/jwt_service")
var createError = require('http-errors')

const checkUser = async (req, res, next) => {
  try {
    const { email, password } = req.value.body
    const user = await UserServices.isCheckEmail(email);
    if (!user) {
      throw createError.NotFound("User not registered")
    }

    req.params.user = user
    
    const isValidPassword = await user.isCheckPassword(password)
    if (!isValidPassword) {
      throw createError.Unauthorized()
    }
    next();
  } catch (error) {
    next(error);
  }
};

const createAndSaveToken = async (req, res, next) => {
  try {
    const newToken = await jwt_service.newToken(req.params.user)
    res.cookie("x_access_token", newToken, {
      expires: new Date(Date.now() + 259200000), //259200000 3 days
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

const renderLoginPage = async (req, res, next) => {
  try {
    let token = req.cookies.x_access_token;
    if (token) {
      res.redirect("back");
    } else {
      res.render("login");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkUser,
  createAndSaveToken,
  renderLoginPage,
};
