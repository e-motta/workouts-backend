const { Mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const ExerciseSchema = require("../models/Exercise");
const MuscleGroupSchema = require("../models/MuscleGroup");
const SessionSchema = require("../models/Session");

exports.exercises_get = asyncHandler(async (req, res, next) => {
  const data = await ExerciseSchema.find(
    {},
    "id name user muscle_group created_at updated_at"
  ).populate("muscle_group");

  res.json({
    success: true,
    message: "Exercises retrieved successfully.",
    data,
  });
});

exports.exercises_get_detail = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Exercise not found");
    err.status = 404;
    return next(err);
  }

  const data = await ExerciseSchema.findById(
    req.params.id,
    "id name user muscle_group created_at updated_at"
  ).populate("muscle_group");

  if (!data) {
    const err = new Error("Exercise not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: "Exercise retrieved successfully.",
    data,
  });
});

exports.exercises_create = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("name").custom(async (value, { req }) => {
    const nameExists = await ExerciseSchema.exists({
      name: { $regex: new RegExp(`^${value.toLowerCase()}$`, "i") },
      user: req.user.id,
    });
    // empty string will mistakenly match an existing name
    if (value.length > 0 && nameExists)
      throw new Error(`Exercise '${value}' already exists.`);
    return true;
  }),
  body("muscle_group_id").trim().escape(),
  body("muscle_group_id").custom(async (value, { req }) => {
    if (
      value.length > 0 &&
      (!Mongoose.prototype.isValidObjectId(value) ||
        !(await MuscleGroupSchema.exists({ _id: value, user: req.user.id })))
    ) {
      throw new Error("Muscle Group not found");
    }
  }),
  body("muscle_group_id").custom(async (value, { req }) => {
    if (value.length > 0 && req.body.muscle_group_name.length > 0) {
      throw new Error(
        "Either muscle_group_id or muscle_group_name must be provided, but not both"
      );
    }
  }),
  body("muscle_group_name").trim().escape(),
  body("muscle_group_name").custom(async (value, { req }) => {
    if (
      value.length > 0 &&
      (await MuscleGroupSchema.exists({
        name: { $regex: new RegExp(`^${value.toLowerCase()}$`, "i") },
        user: req.user.id,
      }))
    ) {
      throw new Error(`Muscle Group '${value}' already exists`);
    }
  }),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { name, muscle_group_id, muscle_group_name } = req.body;

    if (muscle_group_id.length === 0 && muscle_group_name.length === 0) {
      res.status(400).json({
        success: false,
        message:
          "Either muscle_group_id or muscle_group_name must be provided.",
      });
      return;
    }

    let muscleGroup;

    if (muscle_group_id.length === 0) {
      muscleGroup = new MuscleGroupSchema({
        name: muscle_group_name,
        user: req.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await muscleGroup.save();
    } else {
      muscleGroup = await MuscleGroupSchema.findById(muscle_group_id);
    }

    const exercise = new ExerciseSchema({
      name,
      user: req.user.id,
      muscle_group: muscleGroup,
      created_at: new Date(),
      updated_at: new Date(),
    });

    exercise.save();

    res.json({
      success: true,
      message: "Exercise created successfully.",
      data: {
        _id: exercise._id,
        name: exercise.name,
        user: exercise.user,
        muscle_group: muscleGroup,
        created_at: exercise.created_at,
        updated_at: exercise.updated_at,
      },
    });
  }),
];

exports.exercises_update = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("name").custom(async (value, { req }) => {
    const nameExists = await MuscleGroupSchema.exists({
      name: { $regex: new RegExp(`^${value.toLowerCase()}$`, "i") },
      user: req.user.id,
    });
    // empty string will mistakenly match an existing name
    if (value.length > 0 && nameExists)
      throw new Error(`Muscle Group '${value}' already exists.`);
    return true;
  }),
  body("muscle_group_id").trim().escape(),
  body("muscle_group_id").custom(async (value, { req }) => {
    if (
      value.length > 0 &&
      (!Mongoose.prototype.isValidObjectId(value, { req }) ||
        !(await MuscleGroupSchema.exists({ _id: value, user: req.user.id })))
    ) {
      throw new Error("Muscle Group not found");
    }
  }),
  body("muscle_group_id").custom(async (value, { req }) => {
    if (value.length > 0 && req.body.muscle_group_name.length > 0) {
      throw new Error(
        "Either muscle_group_id or muscle_group_name must be provided, but not both"
      );
    }
  }),
  body("muscle_group_name").trim().escape(),
  body("muscle_group_name").custom(async (value, { req }) => {
    if (
      value.length > 0 &&
      (await MuscleGroupSchema.exists({
        name: { $regex: new RegExp(`^${value.toLowerCase()}$`, "i") },
        user: req.user.id,
      }))
    ) {
      throw new Error(`Muscle Group '${value}' already exists`);
    }
  }),

  asyncHandler(async function (req, res, next) {
    if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
      const err = new Error("Exercise not found");
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
      const exercise = await ExerciseSchema.findById(
        req.params.id,
        "id name muscle_group created_at updated_at"
      );

      if (!exercise) {
        const err = new Error("Muscle Group not found");
        err.status = 404;
        return next(err);
      }

      const { name, muscle_group_id, muscle_group_name } = req.body;
      const upated_at = new Date();

      let muscleGroup;

      if (muscle_group_id.length === 0) {
        muscleGroup = new MuscleGroupSchema({
          name: muscle_group_name,
          user: req.user.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
        await muscleGroup.save();
      } else {
        muscleGroup = await MuscleGroupSchema.findById(muscle_group_id);
      }

      exercise.name = name;
      exercise.muscle_group = muscleGroup;
      exercise.updated_at = upated_at;

      await exercise.save();

      res.json({
        success: true,
        message: "Exercise updated successfully.",
        data: {
          _id: exercise._id,
          name,
          user: exercise.user,
          muscle_group: muscleGroup,
          created_at: exercise.created_at,
          updated_at: upated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }),
];

exports.exercises_delete = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Exercise not found");
    err.status = 404;
    return next(err);
  }

  const exerciseExists = await ExerciseSchema.exists({
    _id: req.params.id,
    user: req.user.id,
  });

  if (exerciseExists) {
    await SessionSchema.deleteMany({ exercise: req.params.id });
    await ExerciseSchema.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Exercise and related Sessions deleted successfully.",
    });
  } else {
    const err = new Error("Exercise not found");
    err.status = 404;
    return next(err);
  }
});
