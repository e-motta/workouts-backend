const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

module.exports = mongoose.model("Workout", WorkoutSchema);
