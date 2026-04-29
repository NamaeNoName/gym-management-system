import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Manager', 'User', 'Trainer'], 
    default: 'User' 
  },
  enrolledPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership' },
  assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' }
});

export default mongoose.model("User", userSchema);