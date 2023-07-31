const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  exercise: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
  workout: { type: Schema.Types.ObjectId, ref: "Workout", required: true },
  series: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
  rest: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

module.exports = mongoose.model("Session", SessionSchema);