import express from "express";
const router = express.Router();
import Membership from "../models/Membership.js";
import User from "../models/User.js";

// --- АВТОРИЗАЦИЯ ---
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });
    if (user.password !== password) return res.status(401).json({ message: "Неверный пароль" });

    // Populate теперь будет работать корректно, так как мы поправили ref в модели
    const populatedUser = await User.findById(user._id)
      .populate('enrolledPlan')
      .populate('assignedTrainer');

    res.json({ user: populatedUser || user });
  } catch (err) {
    console.error("Ошибка при входе:", err);
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) return res.status(400).json({ message: "Этот логин уже занят" });

    const newUser = await User.create({ email, password, role: role || "User" });
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Ошибка регистрации:", err);
    res.status(500).json({ message: "Ошибка регистрации: " + err.message });
  }
});

// --- УПРАВЛЕНИЕ РОЛЯМИ ---
router.patch("/users/role", async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Ошибка обновления роли" });
  }
});

// --- АДМИН ПАНЕЛЬ ---
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate('enrolledPlan assignedTrainer');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ТАРИФЫ ---
router.get("/memberships", async (req, res) => {
  try {
    const plans = await Membership.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: "Ошибка загрузки тарифов" });
  }
});

router.post("/memberships", async (req, res) => {
  try {
    const newPlan = await Membership.create(req.body);
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ message: "Ошибка создания тарифа" });
  }
});

// --- УДАЛЕНИЕ ---
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Пользователь удален" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления" });
  }
});

router.delete("/memberships/:id", async (req, res) => {
  try {
    await Membership.findByIdAndDelete(req.params.id);
    res.json({ message: "Тариф удален" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления" });
  }
});

// --- ЗАПИСЬ ---
router.post("/enroll-full", async (req, res) => {
  try {
    const { userId, planId, trainerId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { enrolledPlan: planId, assignedTrainer: trainerId },
      { new: true }
    ).populate('enrolledPlan assignedTrainer');
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Ошибка записи: " + err.message });
  }
});

router.get("/trainers", async (req, res) => {
  try {
    const trainers = await User.find({ role: 'Trainer' });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: "Ошибка загрузки тренеров" });
  }
});

export default router;