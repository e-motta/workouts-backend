const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OverallStatsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  latest_session: {
    type: Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  avgEstimated1RM: { type: Number, required: true },
  avgTrainingVolume: { type: Number, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

module.exports = mongoose.model("OverallStats", OverallStatsSchema);
