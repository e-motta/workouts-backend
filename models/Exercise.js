const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  muscle_group: {
    type: Schema.Types.ObjectId,
    ref: "MuscleGroup",
    required: true,
  },
  workout: { type: Schema.Types.ObjectId, ref: "Workout", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

module.exports = mongoose.model("Exercise", ExerciseSchema);
