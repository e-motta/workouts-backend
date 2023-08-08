const { Mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");

const SessionStatsSchema = require("../models/SessionStats");

exports.session_stats_get = asyncHandler(async (req, res, next) => {
  const data = await SessionStatsSchema.find(
    req.user.roles.includes("admin") ? {} : { user: req.user.id },
    "id name session exercise estimated1RM relativeIntensity trainingVolume densityLoad created_at updated_at"
  );

  res.json({
    success: true,
    message: "Session Statistics retrieved successfully.",
    data,
  });
});

exports.session_stats_get_detail = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Session Statistics not found");
    err.status = 404;
    return next(err);
  }

  const data = await SessionStatsSchema.findById(
    req.params.id,
    "id name session exercise estimated1RM relativeIntensity trainingVolume densityLoad created_at updated_at"
  );

  if (!data) {
    const err = new Error("Session Statistics not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: "Session Statistics retrieved successfully.",
    data,
  });
});
