const JWT = require("jsonwebtoken");
var createError = require('http-errors')
const encodeToken = (user) => {
  return JWT.sign(
    {
      iss: "EduQuiz",
      userID: user._id.toString(),
      username:user.username,
      imageProfile: user.imageProfile,
      role: user.role,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    process.env.ACCESS_TOKEN_SECRET
  );
};
const decodeToken = (token) => {
  return JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie("x_access_token")
      if (err.name === "JsonWebTokenError") {
        return next(createError.Unauthorized())
      }
      return next(createError.Unauthorized(err.message))
    };

    if (decoded) return decoded;
  });
};


const verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies.x_access_token;
    if (token) {
      var decode = await decodeToken(req.cookies.x_access_token);
      if (decode) {
        res.set("Authorization", decode.userID)
        req.params.userinfo=({
          'username':decode.username,
          'imageProfile': decode.imageProfile,
          'role': decode.role
        })
        next();
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
};


const newToken = async (user) => {
  const token = await encodeToken(user);
  return token
}

// const saveSessionAndResponeForUser = (req, res, decode) => {
//   req.session.user = decode.sub;
//   res.locals.session = req.session.user;
// };

// function test() {
//     var decode = JWT.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJFZHVRdWl6Iiwic3ViIjoiNjQ4ZWQ2NDU4MDJiNTM0ZDViYzE0NTIwIiwiaWF0IjoxNjg3Mjc5MjgxMDEzLCJleHAiOjE2ODcyNzkyODQ2MTN9.1JS2ukdkFhelqZqoY6_CRFUHsZkd4jlxfgbK7KZis9Y",
//         "NguyendungAuthentication",
//         function (err, decoded) {
//             // err
//             if (err) return null;
//             // decoded undefined
//             if (decoded) return decoded;
//         })

//     if (decode) console.log(decode);
//     if (!decode) console.log("fail");
// }
// test()

module.exports = {
  verifyToken,
  newToken
};
