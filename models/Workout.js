const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  name: { type: String, required: true },
  exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  sessions: [{ type: Schema.Types.ObjectId, ref: "Session" }],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, required: true },
});

module.exports = mongoose.model("Workout", WorkoutSchema);
