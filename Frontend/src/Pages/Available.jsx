import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from '../Components/TaskCard';

/**
 * Available Component
 * Fetches and displays tasks that are pending and not created by the current user.
 */
export default function Available() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvailableTasks = async () => {
    try {
      setLoading(true);
      
      // 1. Get current user from localStorage to filter tasks
      const storedUser = localStorage.getItem('currentUser');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      if (!currentUser || !currentUser._id) {
        setError("Please log in to view available favors.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/tasks/available/${currentUser._id}`);
      
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError("Failed to load favors. Please ensure the backend is running.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableTasks();
  }, []);

  // Show loading state while waiting for MongoDB
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  // Show error state if something goes wrong
  if (error) {
    return (
      <div className="flex-1 p-8 text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <button 
          onClick={fetchAvailableTasks}
          className="mt-4 text-cyan-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="inline-block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">
            Hostel Favors
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Available Favors</h1>
          <p className="text-slate-600 text-base">
            Browse and accept favors from your hostel mates to earn karma points
          </p>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id} 
                taskId={task._id}
                title={task.title}
                reward={task.rewardPoints} 
                description={task.description}
                // Accessing populated user data
                requesterName={task.requester?.name || "Unknown Resident"}
                roomNumber={task.requester?.roomNo || "N/A"}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500">No favors available right now. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}