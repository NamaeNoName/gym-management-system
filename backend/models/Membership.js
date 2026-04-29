import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  description: String
});

export default mongoose.model("Membership", membershipSchema);