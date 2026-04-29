import express from "express";
import Membership from "../models/Membership.js";
import Trainer from "../models/Trainer.js";
import User from "../models/User.js";

const router = express.Router();

// --- АБОНЕМЕНТЫ ---
router.get("/memberships", async (req, res) => {
  const plans = await Membership.find();
  res.json(plans);
});

router.post("/memberships", async (req, res) => {
  const newPlan = await Membership.create(req.body);
  res.status(201).json(newPlan);
});

router.delete("/memberships/:id", async (req, res) => {
  await Membership.findByIdAndDelete(req.params.id);
  res.json({ message: "План удален" });
});

// --- ТРЕНЕРЫ ---
router.get("/trainers", async (req, res) => {
  const trainers = await Trainer.find();
  res.json(trainers);
});

router.delete("/trainers/:id", async (req, res) => {
  await Trainer.findByIdAndDelete(req.params.id);
  res.json({ message: "Тренер удален" });
});

// --- ПОЛЬЗОВАТЕЛИ (Для Админа) ---
router.get("/users", async (req, res) => {
  const users = await User.find().populate('enrolledPlan assignedTrainer');
  res.json(users);
});

router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Пользователь удален" });
});

// --- АВТОРИЗАЦИЯ И ЛОГИКА ЗАПИСИ ---
router.post("/users/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).populate('enrolledPlan assignedTrainer');
  user ? res.json({ user }) : res.status(404).json({ message: "Не найден" });
});

router.post("/enroll-full", async (req, res) => {
  const { userId, planId, trainerId } = req.body;
  const user = await User.findByIdAndUpdate(
    userId, 
    { enrolledPlan: planId, assignedTrainer: trainerId }, 
    { new: true }
  ).populate('enrolledPlan assignedTrainer');
  res.json({ message: "Запись успешно завершена!", user });
});

// Список учеников для конкретного тренера
router.get("/my-trainees/:trainerId", async (req, res) => {
  const trainees = await User.find({ assignedTrainer: req.params.trainerId }).populate('enrolledPlan');
  res.json(trainees);
});

export default router;