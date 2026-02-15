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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshTokenHandler);
router.get("/profile", authMiddleware, getUserProfile);
router.get("/leaderboard", getLeaderboard);

export default router;