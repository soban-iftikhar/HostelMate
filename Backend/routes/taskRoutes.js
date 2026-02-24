import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createTask,
  getAvailableTasks,
  acceptTask,
  completeTask,
  getMyTasks,
  getHistory,
  updateOwnTask,
  deleteOwnTask
} from '../controllers/taskController.js';

const router = express.Router();

// Create a new task (Protected)
router.post('/create', authMiddleware, createTask);

// Get available tasks (Protected)
router.get('/available', authMiddleware, getAvailableTasks);

// Accept a task (Protected)
router.put('/accept', authMiddleware, acceptTask);

// Complete a task (Protected)
router.put('/complete/:id', authMiddleware, completeTask);

// Get user's tasks (Protected)
router.get('/myTasks', authMiddleware, getMyTasks);

// Get user's completed task history (Protected)
router.get('/history', authMiddleware, getHistory);

// Update own task (Protected)
router.put('/update/:id', authMiddleware, updateOwnTask);

// Delete own task (Protected)
router.delete('/delete/:id', authMiddleware, deleteOwnTask);

export default router;
