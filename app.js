const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");

const { log, logError } = require("./logger");
const useDatabase = require("./database");
const usersRouter = require("./routes/users");
const muscleGroupsRouter = require("./routes/muscleGroups");
const exercisesRouter = require("./routes/exercises");
const workoutsRouter = require("./routes/workouts");
const sessionsRouter = require("./routes/sessions");
const authRouter = require("./routes/auth");
const auth = require("./auth");

const app = express();

app.use(log);

useDatabase().catch((err) => console.error(err));

const corsOptions = {
  origin: ["https://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      formAction: ["'self'"],
    },
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);

app.use("/api/users", auth.authenticateToken, usersRouter);
app.use("/api/muscle_groups", auth.authenticateToken, muscleGroupsRouter);
app.use("/api/exercises", auth.authenticateToken, exercisesRouter);
app.use("/api/workouts", auth.authenticateToken, workoutsRouter);
app.use("/api/sessions", auth.authenticateToken, sessionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  logError(err);

  res.status(err.status || 500);
  res.json({ success: false, message: err.message });
});

module.exports = app;
