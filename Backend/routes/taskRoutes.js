import express from 'express';
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

// Create a new task
router.post('/create', createTask);

// Get available tasks (pending tasks not created by requesting user)
router.get('/available', getAvailableTasks);

// Accept a task (user volunteers to help)
router.put('/accept', acceptTask);

// Complete a task (mark as completed and award points)
router.put('/complete/:id', completeTask);

// Get user's tasks (both as requester and helper)
router.get('/myTasks/:userId', getMyTasks);

// Get user's completed task history
router.get('/history/:userId', getHistory);

// Update own task (only if pending)
router.put('/update/:id', updateOwnTask);

// Delete own task (with refund)
router.delete('/delete/:id', deleteOwnTask);

export default router;
