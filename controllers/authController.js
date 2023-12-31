const asyncHandler = require("express-async-handler");
const auth = require("../auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = asyncHandler(function (req, res, next) {
  auth.passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const err = new Error(info.message || "Authentication failed");
      err.status = 401;
      return next(err);
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        roles: user.roles,
      },
      process.env.JWT_ACCESS_SECRET,
      (options = req.body.remember_me
        ? undefined
        : {
            expiresIn: "24h",
          })
    );

    res.cookie("accessToken", token, { httpOnly: true }); // todo: add 'secure: true'

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
      },
    });
  })(req, res, next);
});

exports.logout = asyncHandler(function (req, res, next) {
  res.cookie("accessToken", "", { httpOnly: true, expires: new Date(0) }); // todo: add 'secure: true'

  res.json({
    success: true,
    message: "User logged out successfully.",
  });
});
