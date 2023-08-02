const asyncHandler = require("express-async-handler");
const auth = require("../auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = asyncHandler(function (req, res, next) {
  auth.passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        roles: user.roles,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      success: true,
      message: "User logged in successfully.",
      data: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        roles: user.roles,
        created_at: user.created_at,
        updated_at: user.updated_at,
        token,
      },
    });
  })(req, res, next);
});
