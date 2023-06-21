const { token } = require("morgan");
const UserServices = require("../services/user.services");
const JWT = require("jsonwebtoken");

const encodeToken = (userID) => {
  return JWT.sign(
    {
      iss: "EduQuiz",
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    process.env.SECRET_TOKEN
  );
};
const checkUser = async (req, res, next) => {
  try {
    const user = await UserServices.checkUserExists(req.value.body);
    if (user) {
      req.params.idUser = user._id.toString();
      next();
    } else {
      return res.status(400).json({ message: "wrong email or password" });
    }
  } catch (error) {
    next(error);
  }
};

const createAndSaveToken = async (req, res, next) => {
  try {
    const newToken = await encodeToken(req.params.idUser);
    res.cookie("x_access_token", newToken, {
      expires: new Date(Date.now() + 259200000),
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

const loadLoginPage = async (req, res, next) => {
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
  loadLoginPage,
};
