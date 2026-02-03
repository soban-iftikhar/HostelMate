import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getLeaderboard,
} from "../controllers/userController.js";

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Get User Profile
router.get("/profile/:userId", getUserProfile);

// Get Leaderboard
router.get("/leaderboard", getLeaderboard);

export default router;