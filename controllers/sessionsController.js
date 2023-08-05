const { Mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const SessionSchema = require("../models/Session");
const ExerciseSchema = require("../models/Exercise");

exports.sessions_get = asyncHandler(async (req, res, next) => {
  const data = await SessionSchema.find(
    req.user.roles.includes("admin") ? {} : { user: req.user.id },
    "id name exercise workout series reps weight rest user created_at updated_at"
  );

  res.json({
    success: true,
    message: "Sessions retrieved successfully.",
    data,
  });
});

exports.sessions_get_detail = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Session not found");
    err.status = 404;
    return next(err);
  }

  const data = await SessionSchema.findById(
    req.params.id,
    "id name exercise workout series reps weight rest user created_at updated_at"
  );

  if (!data) {
    const err = new Error("Session not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: "Session retrieved successfully.",
    data,
  });
});

exports.sessions_create = [
  body("exercise", "Exercise must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("exercise").custom(async (value, { req }) => {
    if (!Mongoose.prototype.isValidObjectId(value)) {
      throw new Error(`Exercise with id '${value}' does not exist.`);
    }
    const exerciseExists = await ExerciseSchema.exists({
      _id: value,
      user: req.user.id,
    });
    if (!exerciseExists)
      throw new Error(`Exercise with id '${value}' does not exist.`);
    return true;
  }),
  body("series", "Series must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("reps", "Repetitions must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("rest", "Rest must not be empty.").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { exercise, series, reps, weight, rest, date } = req.body;

    const exercise_obj = await ExerciseSchema.findById(exercise, "workout");

    const session = new SessionSchema({
      exercise,
      workout: exercise_obj.workout,
      series,
      reps,
      weight: weight ? weight : 0,
      rest,
      user: req.user.id,
      date: date ? date : new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });
    await session.save();

    res.json({
      success: true,
      message: "Session created successfully.",
      data: {
        id: session._id,
        exercise: session.exercise,
        workout: session.workout,
        series: session.series,
        reps: session.reps,
        weight: session.weight,
        rest: session.rest,
        user: session.user,
        date: session.date,
        created_at: session.created_at,
        updated_at: session.updated_at,
      },
    });
  }),
];

exports.sessions_update = [
  body("exercise", "Exercise must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("exercise").custom(async (value, { req }) => {
    if (!Mongoose.prototype.isValidObjectId(value)) {
      throw new Error(`Exercise with id '${value}' does not exist.`);
    }
    const exerciseExists = await ExerciseSchema.exists({
      _id: value,
      user: req.user.id,
    });
    if (!exerciseExists)
      throw new Error(`Exercise with id '${value}' does not exist.`);
    return true;
  }),
  body("series", "Series must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("reps", "Repetitions must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("rest", "Rest must not be empty.").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async function (req, res, next) {
    if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
      const err = new Error("Session not found");
      err.status = 404;
      return next(err);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    try {
      const session = await SessionSchema.findById(
        req.params.id,
        "id name exercise workout series reps weight rest user created_at updated_at"
      );

      if (!session) {
        const err = new Error("Session not found");
        err.status = 404;
        return next(err);
      }

      const { exercise, series, reps, weight, rest, date } = req.body;
      const upated_at = new Date();

      session.exercise = exercise;
      session.series = series;
      session.reps = reps;
      session.weight = weight;
      session.rest = rest;
      session.date = date;
      session.updated_at = upated_at;

      await session.save();

      res.json({
        success: true,
        message: "Session updated successfully.",
        data: {
          _id: session._id,
          exercise: session.exercise,
          workout: session.workout,
          series: session.series,
          reps: session.reps,
          weight: session.weight,
          rest: session.rest,
          user: session.user,
          date: session.date,
          created_at: session.created_at,
          updated_at: upated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }),
];

exports.sessions_delete = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Session not found");
    err.status = 404;
    return next(err);
  }

  const session = await SessionSchema.findByIdAndDelete(req.params.id);

  if (!session) {
    const err = new Error("Session not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: "Session deleted successfully.",
    data: session,
  });
});
