const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionStatsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
  exercise: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
  estimated1RM: { type: Number, required: true },
  relativeIntensity: { type: Number, required: true },
  trainingVolume: { type: Number, required: true },
  densityLoad: { type: Number, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

module.exports = mongoose.model("SessionStats", SessionStatsSchema);
