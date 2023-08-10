const { Mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");

const OverallStatsSchema = require("../models/OverallStats");

exports.overall_stats_get = asyncHandler(async (req, res, next) => {
  const data = await OverallStatsSchema.find(
    req.user.roles.includes("admin") ? {} : { user: req.user.id },
    "id user latest_session avgEstimated1RM avgTrainingVolume created_at updated_at"
  );

  res.json({
    success: true,
    message: "Overall Statistics retrieved successfully.",
    data,
  });
});

exports.overall_stats_get_detail = asyncHandler(async (req, res, next) => {
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Overall Statistics not found");
    err.status = 404;
    return next(err);
  }

  const data = await OverallStatsSchema.findById(
    req.params.id,
    "id user latest_session avgEstimated1RM avgTrainingVolume created_at updated_at"
  );

  if (!data) {
    const err = new Error("Overall Statistics not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    success: true,
    message: "Overall Statistics retrieved successfully.",
    data,
  });
});
