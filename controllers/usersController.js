const { Mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const UserSchema = require("../models/user");

exports.users_get = asyncHandler(async (req, res, next) => {
  const users = await UserSchema.find(
    req.user.roles.includes("admin") ? {} : { user: req.user.id },
    "id first_name last_name email roles created_at updated_at"
  );

  res.json({
    success: true,
    message: "Users retrieved successfully.",
    data: users,
  });
});

exports.users_get_detail = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  const user = await UserSchema.findById(
    req.params.id,
    "id first_name last_name email roles created_at updated_at"
  );

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: "User retrieved successfully.",
    data: user,
  });
});

exports.users_create = [
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email").custom(async (value) => {
    value = value.toLowerCase();
    const emailExists = await UserSchema.exists({ email: value });
    if (emailExists) {
      throw new Error("Email already in use.");
    }
    return true;
  }),
  body("email").custom(async (value) => {
    value = value.toLowerCase();
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(value)) {
      throw new Error("Email is invalid.");
    }
    return true;
  }),
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password").custom((value) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(value)) {
      throw new Error(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
      );
    }
    return true;
  }),
  body("confirm_password", "Password confirmation must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password.");
    }
    return true;
  }),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    const { first_name, last_name, email, password } = req.body;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    try {
      bcrypt.hash(password, 10, async (err, hashed_password) => {
        if (err) {
          return next(err);
        }

        const user = new UserSchema({
          first_name,
          last_name,
          email,
          hashed_password,
          roles: [],
          created_at: new Date(),
          updated_at: new Date(),
        });
        await user.save();

        res.json({
          success: true,
          message: "User created successfully.",
          data: {
            id: user._id,
            first_name,
            last_name,
            email,
            created_at: user.created_at,
            created_at: user.updated_at,
          },
        });
      });
    } catch (err) {
      next(err);
    }
  }),
];

exports.users_update = [
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email").custom(async (value, { req }) => {
    value = value.toLowerCase();
    const emailExists = await UserSchema.exists({ email: value });
    if (emailExists) {
      const user = await UserSchema.findById(req.params.id);
      if (user.email !== value) throw new Error("Email already in use.");
    }
    return true;
  }),
  body("email").custom(async (value) => {
    value = value.toLowerCase();
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(value)) {
      throw new Error("Email is invalid.");
    }
    return true;
  }),
  body("password", "Password cannot be changed in this endpoint.")
    .trim()
    .isLength({ max: 0 })
    .escape(),
  body("confirm_password", "Password confirmation cannot be changed.")
    .trim()
    .isLength({ max: 0 })
    .escape(),

  asyncHandler(async function (req, res, next) {
    if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const errors = validationResult(req);

    const { first_name, last_name, email } = req.body;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    try {
      const user = await UserSchema.findById(
        req.params.id,
        "id first_name last_name email created_at updated_at"
      );

      if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }

      const upated_at = new Date();

      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.updated_at = upated_at;

      await user.save();

      res.json({
        success: true,
        message: "User updated successfully.",
        data: {
          id: user._id,
          first_name,
          last_name,
          email,
          created_at: user.created_at,
          updated_at: upated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }),
];

exports.users_delete = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  const userExists = await UserSchema.exists({ _id: req.params.id });

  if (userExists) {
    await UserSchema.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "User deleted successfully.",
    });
  } else {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
});

// exports.users_add_to_array_field = asyncHandler(async (req, res, next) => {
//   if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
//     const err = new Error("User not found");
//     err.status = 404;
//     return next(err);
//   }

//   const user = await UserSchema.findById(req.params.id);

//   if (!user) {
//     const err = new Error("User not found");
//     err.status = 404;
//     return next(err);
//   }

//   const { field, value } = req.body;

//   if (!user[field]) {
//     const err = new Error("Field not found");
//     err.status = 404;
//     return next(err);
//   }

//   if (user[field].includes(value)) {
//     const err = new Error("Value already exists in array");
//     err.status = 400;
//     return next(err);
//   }

//   user[field].push(value);
//   await user.save();

//   res.json({
//     success: true,
//     message: "Value added to array field successfully.",
//     data: user[field],
//   });
// });
