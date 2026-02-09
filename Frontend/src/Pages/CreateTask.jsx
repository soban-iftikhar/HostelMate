import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateTask() {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserKarma, setCurrentUserKarma] = useState(0);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    rewardPoints: ''
  });
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('currentUser');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      
      if (!currentUser || !currentUser._id) {
        navigate('/login');
        return;
      }

      const userId = currentUser._id;
      setCurrentUserId(userId);

      try {
        const userResponse = await axios.get(`http://localhost:5000/api/users/profile/${userId}`);
        setCurrentUserKarma(userResponse.data.karmaPoints);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setCreateError('Failed to load your karma balance. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
    setCreateError('');
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    // Validation
    if (!createForm.title.trim()) {
      setCreateError('Title is required');
      setCreating(false);
      return;
    }
    if (!createForm.description.trim()) {
      setCreateError('Description is required');
      setCreating(false);
      return;
    }
    if (!createForm.rewardPoints || createForm.rewardPoints <= 0) {
      setCreateError('Reward points must be a positive number');
      setCreating(false);
      return;
    }

    // Check if user has enough karma points
    if (Number(createForm.rewardPoints) > currentUserKarma) {
      setCreateError(`Insufficient balance! You have ${currentUserKarma} karma points but trying to offer ${createForm.rewardPoints} points.`);
      setCreating(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/tasks/create', {
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        rewardPoints: Number(createForm.rewardPoints),
        requester: currentUserId
      });

      // Success - navigate to activity page
      window.dispatchEvent(new Event('karma-updated'));
      navigate('/dashboard/activity');
    } catch (error) {
      console.error('Error creating task:', error);
      setCreateError(error.response?.data?.message || 'Failed to create task. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="text-slate-600 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <span className="inline-block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">
            New Request
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">Create New Task</h1>
          <p className="text-slate-600 text-xs sm:text-base">
            Request help from your hostel mates and reward them with karma points
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-200">
          <form onSubmit={handleCreateTask} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {createError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                {createError}
              </div>
            )}

            <div className="bg-cyan-50 border border-cyan-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
              <p className="text-xs sm:text-sm text-cyan-800">
                <span className="font-semibold">Available Balance:</span> {currentUserKarma} karma points
              </p>
            </div>

            <div>
              <label htmlFor="create-title" className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="create-title"
                name="title"
                value={createForm.title}
                onChange={handleCreateChange}
                placeholder="e.g., Help with laundry"
                className="w-full rounded-lg border border-slate-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                disabled={creating}
              />
            </div>

            <div>
              <label htmlFor="create-description" className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="create-description"
                name="description"
                value={createForm.description}
                onChange={handleCreateChange}
                placeholder="Describe the task in detail..."
                rows="4"
                className="w-full rounded-lg border border-slate-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition resize-none"
                disabled={creating}
              />
            </div>

            <div>
              <label htmlFor="create-rewardPoints" className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                Reward Points <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                id="create-rewardPoints"
                name="rewardPoints"
                value={createForm.rewardPoints}
                onChange={handleCreateChange}
                placeholder="Enter points to reward"
                min="1"
                max={currentUserKarma}
                className="w-full rounded-lg border border-slate-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                disabled={creating}
              />
              <p className="mt-2 text-xs text-slate-500">
                These points will be deducted from your karma balance
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60 transition duration-200"
              >
                {creating ? 'Creating...' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/activity')}
                disabled={creating}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
