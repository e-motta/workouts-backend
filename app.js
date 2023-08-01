const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const useDatabase = require("./database");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const muscleGroupsRouter = require("./routes/muscleGroups");
const exercisesRouter = require("./routes/exercises");
const workoutsRouter = require("./routes/workouts");
const sessionsRouter = require("./routes/sessions");
const authRouter = require("./routes/auth");
const auth = require("./auth");

const app = express();

useDatabase().catch((err) => console.error(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use(auth.authenticateToken);

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/muscle_groups", muscleGroupsRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/workouts", workoutsRouter);
app.use("/api/sessions", sessionsRouter);

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
