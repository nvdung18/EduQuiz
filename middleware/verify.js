const JWT = require("jsonwebtoken");
const decodeToken = (token) => {
  return JWT.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) return null;
    if (decoded) return decoded;
  });
};

const verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies.x_access_token;
    if (token) {
      var decode = await decodeToken(req.cookies.x_access_token);
      //check decode
      if (decode) {
        next();
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
};

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
};
