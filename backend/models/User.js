import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Trainer', 'User'], 
    default: 'User' 
  },
  enrolledPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership' },
  // ИСПРАВЛЕНО: Ссылаемся на модель 'User', так как отдельной модели Trainer нет
  assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  joinDate: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);