const { Mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const WorkoutSchema = require("../models/Workout");
const ExerciseSchema = require("../models/Exercise");
const SessionSchema = require("../models/Session");

exports.workouts_get = asyncHandler(async (req, res, next) => {
  const data = await WorkoutSchema.find(
    req.user.roles.includes("admin") ? {} : { user: req.user.id },
    "id name user exercises created_at updated_at"
  );

  res.json({
    success: true,
    message: "Workouts retrieved successfully.",
    data,
  });
});

exports.workouts_get_detail = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Workout not found");
    err.status = 404;
    return next(err);
  }

  const data = await WorkoutSchema.findById(
    req.params.id,
    "id name user exercises created_at updated_at"
  );

  if (!data) {
    const err = new Error("Workout not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: "Workout retrieved successfully.",
    data,
  });
});

exports.workouts_create = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { name } = req.body;

    const workout = new WorkoutSchema({
      name,
      user: req.user.id,
      exercises: [],
      created_at: new Date(),
      updated_at: new Date(),
    });
    await workout.save();

    res.json({
      success: true,
      message: "Workout created successfully.",
      data: {
        id: workout._id,
        name: workout.name,
        user: workout.user,
        exercises: workout.exercises,
        created_at: workout.created_at,
        updated_at: workout.updated_at,
      },
    });
  }),
];

exports.workouts_update = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async function (req, res, next) {
    if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
      const err = new Error("Workout not found");
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
      const workout = await WorkoutSchema.findById(
        req.params.id,
        "id name user exercises created_at updated_at"
      );

      if (!workout) {
        const err = new Error("Muscle Workout not found");
        err.status = 404;
        return next(err);
      }

      const { name } = req.body;
      const updated_at = new Date();

      workout.name = name;
      workout.updated_at = updated_at;

      await workout.save();

      res.json({
        success: true,
        message: "Workout updated successfully.",
        data: {
          id: workout._id,
          name,
          user: workout.user,
          exercises: workout.exercises,
          created_at: workout.created_at,
          updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }),
];

exports.workouts_delete = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Workout not found");
    err.status = 404;
    return next(err);
  }

  const workoutExists = await WorkoutSchema.exists({
    _id: req.params.id,
    user: req.user.id,
  });

  if (workoutExists) {
    await SessionSchema.deleteMany({ workout: req.params.id });
    await WorkoutSchema.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Workout and related Sessions deleted successfully.",
    });
  } else {
    const err = new Error("Workout not found");
    err.status = 404;
    return next(err);
  }
});

exports.workouts_add_exercise = [
  body("exercises").custom(async (value, { req }) => {
    if (typeof value !== "object") {
      throw new Error("Exercises must be an array");
    }
    for (let i = 0; i < value.length; i++) {
      if (!Mongoose.prototype.isValidObjectId(value[i])) {
        throw new Error(`Exercise with id '${value[i]}' does not exist.`);
      }
      const exerciseExists = await ExerciseSchema.exists({
        _id: value[i],
        user: req.user.id,
      });
      if (!exerciseExists)
        throw new Error(`Exercise with id '${value[i]}' does not exist.`);
    }
  }),

  asyncHandler(async function (req, res, next) {
    if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
      const err = new Error("Workout not found");
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
      const workout = await WorkoutSchema.findById(
        req.params.id,
        "id name user exercises created_at updated_at"
      );

      if (!workout) {
        const err = new Error("Workout not found");
        err.status = 404;
        return next(err);
      }

      const { exercises } = req.body;
      const updated_at = new Date();

      workout.exercises = exercises;
      workout.updated_at = updated_at;

      await workout.save();

      res.json({
        success: true,
        message: "Workout updated successfully.",
        data: {
          id: workout._id,
          name: workout.name,
          user: workout.user,
          exercises: workout.exercises,
          created_at: workout.created_at,
          updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }),
];
