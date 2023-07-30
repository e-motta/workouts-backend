const { Mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const MuscleGroupSchema = require("../models/MuscleGroup");
const ExerciseSchema = require("../models/Exercise");

exports.muscle_groups_get = asyncHandler(async (req, res, next) => {
  const data = await MuscleGroupSchema.find(
    {},
    "id name user created_at updated_at"
  );

  res.json({
    success: true,
    message: "Muscle Groups retrieved successfully.",
    data,
  });
});

exports.muscle_groups_get_detail = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Muscle Group not found");
    err.status = 404;
    return next(err);
  }

  const data = await MuscleGroupSchema.findById(
    req.params.id,
    "id name user created_at updated_at"
  );

  if (!data) {
    const err = new Error("Muscle Group not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: "Muscle Group retrieved successfully.",
    data,
  });
});

exports.muscle_groups_create = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("name").custom(async (value, { req }) => {
    const nameExists = await MuscleGroupSchema.exists({
      name: { $regex: new RegExp(`^${value.toLowerCase()}$`, "i") },
      user: req.user,
    });
    // empty string will mistakenly match an existing name
    if (value.length > 0 && nameExists)
      throw new Error(`Muscle Group '${value}' already exists.`);
    return true;
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

    const { name } = req.body;

    const muscleGroup = new MuscleGroupSchema({
      name,
      user: req.user,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await muscleGroup.save();

    res.json({
      success: true,
      message: "Muscle Group created successfully.",
      data: {
        id: muscleGroup._id,
        name: muscleGroup.name,
        user: muscleGroup.user,
        created_at: muscleGroup.created_at,
        updated_at: muscleGroup.updated_at,
      },
    });
  }),
];

exports.muscle_groups_update = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("name").custom(async (value, { req }) => {
    const nameExists = await MuscleGroupSchema.exists({
      name: { $regex: new RegExp(`^${value.toLowerCase()}$`, "i") },
      user: req.user,
    });
    // empty string will mistakenly match an existing name
    if (value.length > 0 && nameExists)
      throw new Error(`Muscle Group '${value}' already exists.`);
    return true;
  }),

  asyncHandler(async function (req, res, next) {
    if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
      const err = new Error("Muscle Group not found");
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
      const muscleGroup = await MuscleGroupSchema.findById(
        req.params.id,
        "id name user created_at updated_at"
      );

      if (!muscleGroup) {
        const err = new Error("Muscle Group not found");
        err.status = 404;
        return next(err);
      }

      const { name } = req.body;
      const updated_at = new Date();

      muscleGroup.name = name;
      muscleGroup.updated_at = updated_at;

      await muscleGroup.save();

      res.json({
        success: true,
        message: "Muscle Group updated successfully.",
        data: {
          id: muscleGroup._id,
          name,
          user: muscleGroup.user,
          created_at: muscleGroup.created_at,
          updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }),
];

exports.muscle_groups_delete = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Muscle Group not found");
    err.status = 404;
    return next(err);
  }

  const muscleGroupExists = await MuscleGroupSchema.exists({
    _id: req.params.id,
    user: req.user,
  });

  if (muscleGroupExists) {
    await ExerciseSchema.deleteMany({ muscle_group: req.params.id });
    await MuscleGroupSchema.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Muscle Group and Exercises deleted successfully.",
    });
  } else {
    const err = new Error("Muscle Group not found");
    err.status = 404;
    return next(err);
  }
});
