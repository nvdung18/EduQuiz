require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
const mongoClient = require("./configs/db.config");
var session = require("express-session");

var homeRouter = require("./routes/home");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var createCourseRouter=require("./routes/create_course")
var logoutRouter=require("./routes/logout")
var folderRouter=require("./routes/folders")
var gradeRouter=require("./routes/grades")
var courseRouter=require("./routes/courses")
var searchRouter=require("./routes/search")
var profileRouter=require("./routes/profile")

//default
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

//session
app.use(
  session({
    secret: "nguyendung2511",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);


//router
app.use("/", homeRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/create-course",createCourseRouter)
app.use("/logout",logoutRouter)
app.use("/:username/folders",folderRouter)
app.use("/:username/classes",gradeRouter)
app.use("/:username/courses",courseRouter)
app.use("/search",searchRouter)
app.use("/profile/:username",profileRouter)

//default
app.use("/index", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
  res.json({
    status: err.status,
    message: err.message
  })
});

module.exports = app;
