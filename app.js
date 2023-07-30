var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const useDatabase = require("./database");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var muscleGroupsRouter = require("./routes/muscleGroups");
var exercisesRouter = require("./routes/exercises");

var app = express();

useDatabase().catch((err) => console.error(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  req.user = "64c442c20169a62353cc8643"; // TODO: change this to the logged in user
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/muscle_groups", muscleGroupsRouter);
app.use("/exercises", exercisesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ success: false, message: err.message });
});

module.exports = app;
