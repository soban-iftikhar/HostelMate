import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getLeaderboard,
  refreshTokenHandler,
} from "../controllers/userController.js";

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Refresh Token
router.post("/refresh", refreshTokenHandler);

// Get User Profile (Protected Route)
router.get("/profile", authMiddleware, getUserProfile);

// Get Leaderboard
router.get("/leaderboard", getLeaderboard);

export default router;