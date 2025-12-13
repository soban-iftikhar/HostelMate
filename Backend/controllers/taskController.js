import Task from '../models/Task.js';
import User from '../models/User.js';

// Create a new task
const createTask = async (req, res) => {
  try {
    const { requester, rewardPoints, title, description } = req.body;

    // Input validation
    if (!requester || !rewardPoints || !title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (rewardPoints <= 0) {
      return res.status(400).json({ message: 'Reward points must be positive' });
    }

    // Check if the requester has enough points
    const user = await User.findById(requester);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.karmaPoints < rewardPoints) {
      return res.status(400).json({ message: 'Insufficient karma points' });
    }

    // Deduct points from the requester
    user.karmaPoints -= rewardPoints;
    await user.save();

    // Save the task
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get available tasks excluding those created by the requesting user
const getAvailableTasks = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Fetch tasks that are pending and not created by the requesting user and populate requester details
    const tasks = await Task.find({
      status: 'pending',
      requester: { $ne: userId }
    }).populate('requester', 'name roomNo');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept Task
const acceptTask = async (req, res) => {
  try {
    const { taskId, helperId } = req.body;

    if (!taskId || !helperId) {
      return res.status(400).json({ message: 'taskId and helperId are required' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { helper: helperId, status: 'in-progress' },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Complete Task
const completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task and the helper
    const currentTask = await Task.findById(id);
    if (!currentTask || currentTask.status !== 'in-progress') {
      return res.status(400).json({ message: 'Task must be in-progress first' });
    }

    // Give points to the helper
    await User.findByIdAndUpdate(currentTask.helper, {
      $inc: { karmaPoints: currentTask.rewardPoints }
    });

    // Mark task as completed
    currentTask.status = 'completed';
    await currentTask.save();

    res.status(200).json({ message: 'Task completed! Points awarded to helper.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get own tasks
const getMyTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Fetch tasks where I am the requester OR the helper
    const tasks = await Task.find({
      $or: [
        { requester: userId },
        { helper: userId }
      ]
    }).sort({ createdAt: -1 }); // Show newest first

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update only if user own it AND it's still pending
const updateOwnTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...updateData } = req.body; // Assume userId is sent from frontend

    if (!userId || !id) {
      return res.status(400).json({ message: 'userId and task id are required' });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Ownership & Status Check
    if (task.requester.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    if (task.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot edit a task already in progress' });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete only if user own it (and refund the points!)
const deleteOwnTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId || !id) {
      return res.status(400).json({ message: 'userId and task id are required' });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.requester.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }

    // Refund Logic: Give the points back to the requester
    await User.findByIdAndUpdate(userId, { $inc: { karmaPoints: task.rewardPoints } });

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted and points refunded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createTask,
  getAvailableTasks,
  acceptTask,
  completeTask,
  getMyTasks,
  updateOwnTask,
  deleteOwnTask
};
