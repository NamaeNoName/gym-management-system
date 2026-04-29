import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: String,
  experience: Number,
  rating: { type: Number, default: 0 }
});

export default mongoose.model("Trainer", trainerSchema);