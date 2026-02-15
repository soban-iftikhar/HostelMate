import mongoose from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';
import History from '../models/History.js';

// Creates a new task with reward points. Deducts points from user's karma balance.
// Validates that user has sufficient karma points before creating the task.
const createTask = async (req, res) => {
  try {
    const { rewardPoints, ...taskData } = req.body;
    const requesterId = req.userId;

    if (rewardPoints <= 0) {
      return res.status(400).json({ message: 'Reward points must be positive' });
    }

    const user = await User.findById(requesterId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.karmaPoints < rewardPoints) {
      return res.status(400).json({ message: 'Insufficient karma points' });
    }

    user.karmaPoints -= rewardPoints;
    await user.save();

    const newTask = new Task({ ...taskData, requester: requesterId, rewardPoints });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Retrieves all pending tasks that were not created by the current user.
// Used to display available favors that can be accepted by other users.
const getAvailableTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({
      status: 'pending',
      requester: { $ne: userId }
    }).populate('requester', 'name roomNo');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Allows a user to accept a pending task and become the helper.
// Updates task status to in-progress and assigns the helper user ID.
const acceptTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const helperId = req.userId;

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

// Handles task completion with two-step verification. Helper requests completion
// and requester approves. Rewards helper with karma points and saves to history.
const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const userId = req.userId;

    const currentTask = await Task.findById(id);
    if (!currentTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (currentTask.status !== 'in-progress' && currentTask.status !== 'pending-verification') {
      return res.status(400).json({ message: 'Task must be in-progress or pending verification' });
    }

    if (role === 'helper' && currentTask.helper.toString() === userId) {
      currentTask.status = 'pending-verification';
      currentTask.completionRequestedBy = 'helper';
      await currentTask.save();
      return res.status(200).json({ message: 'Completion request sent to requester for approval' });
    }

    if (role === 'requester' && currentTask.requester.toString() === userId) {
      await User.findByIdAndUpdate(currentTask.helper, {
        $inc: { karmaPoints: currentTask.rewardPoints }
      });

      await History.create({
        taskId: currentTask._id,
        title: currentTask.title,
        description: currentTask.description,
        rewardPoints: currentTask.rewardPoints,
        requester: currentTask.requester,
        helper: currentTask.helper,
        status: 'completed',
        completedAt: new Date()
      });

      await Task.findByIdAndDelete(currentTask._id);

      return res.status(200).json({ message: 'Task completed! Points awarded to helper.' });
    }

    return res.status(403).json({ message: 'Not authorized to perform this action' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetches all active tasks where user is either requester or helper.
// Excludes completed tasks to show only current work in progress.
const getMyTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({
      $and: [
        {
          $or: [
            { requester: userId },
            { helper: userId }
          ]
        },
        { status: { $ne: 'completed' } }
      ]
    })
      .populate('requester', 'name roomNo')
      .populate('helper', 'name roomNo')
      .sort({ createdAt: -1 }); 

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetches completed task history for the authenticated user.
// Shows all tasks where user was either requester or helper, sorted by completion date.
const getHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const history = await History.find({
      $or: [
        { requester: userId },
        { helper: userId }
      ]
    })
      .populate('requester', 'name roomNo')
      .populate('helper', 'name roomNo')
      .sort({ completedAt: -1, createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updates an existing task created by the user. Can only update pending tasks.
// Handles reward point adjustments with karma balance verification.
const updateOwnTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updateData = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.requester.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    if (task.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot edit a task already in progress' });
    }

    if (Object.prototype.hasOwnProperty.call(updateData, 'rewardPoints')) {
      const newReward = Number(updateData.rewardPoints);
      if (Number.isNaN(newReward) || newReward <= 0) {
        return res.status(400).json({ message: 'Reward points must be positive' });
      }

      const diff = newReward - task.rewardPoints;
      if (diff !== 0) {
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (diff > 0) {
          if (user.karmaPoints < diff) {
            return res.status(400).json({ message: 'Insufficient karma points' });
          }
          user.karmaPoints -= diff;
        } else {
          user.karmaPoints += Math.abs(diff);
        }
        await user.save();
      }

      updateData.rewardPoints = newReward;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deletes a task created by the user and refunds karma points.
// Can only delete pending tasks, refunds points to the requester.
const deleteOwnTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.requester.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }

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
  getHistory,
  updateOwnTask,
  deleteOwnTask
};
