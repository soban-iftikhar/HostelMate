import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import TaskCard from '../Components/TaskCard';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';


function Available() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto mb-16 md:mb-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/**
 * Available List
 * Fetches and displays pending tasks not created by the current user.
 */
function AvailableList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvailableTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/tasks/available');
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError("Failed to load favors. Please check your internet connection or try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchAvailableTasks();
    })();
  }, []);

  // Show loading state while waiting for MongoDB
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  // Show error state if something goes wrong
  if (error) {
    return (
      <div className="flex-1 p-4 sm:p-8 text-center">
        <p className="text-red-500 font-medium text-sm">{error}</p>
        <button 
          onClick={fetchAvailableTasks}
          className="mt-4 text-cyan-600 hover:underline font-semibold cursor-pointer text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <span className="inline-block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">
            Hostel Favors
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">Available Favors</h1>
          <p className="text-slate-600 text-xs sm:text-base">
            Browse and accept favors from your hostel mates to earn karma points
          </p>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                taskId={task._id}
                title={task.title}
                reward={task.rewardPoints}
                description={task.description}
                requesterName={task.requester?.name || "Unknown Resident"}
                roomNumber={task.requester?.roomNo || "N/A"}
                onAcceptSuccess={fetchAvailableTasks}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 text-sm sm:text-base">No favors available right now. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Available;
export { AvailableList };