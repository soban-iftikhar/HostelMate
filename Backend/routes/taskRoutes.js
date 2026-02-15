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

router.post('/create', authMiddleware, createTask);
router.get('/available', authMiddleware, getAvailableTasks);
router.put('/accept', authMiddleware, acceptTask);
router.put('/complete/:id', authMiddleware, completeTask);
router.get('/myTasks', authMiddleware, getMyTasks);
router.get('/history', authMiddleware, getHistory);
router.put('/update/:id', authMiddleware, updateOwnTask);
router.delete('/delete/:id', authMiddleware, deleteOwnTask);

export default router;
