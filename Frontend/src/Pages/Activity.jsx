import { CheckCircle, Clock, AlertCircle, Pencil, Trash2, Eye, X } from 'lucide-react';
import { useState, useEffect} from 'react';
import axios from 'axios';

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    rewardPoints: '',
    status: 'pending'
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);

  const fetchActivities = async () => {
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = currentUser ? currentUser._id : null;
    setCurrentUserId(userId);

    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/myTasks/${userId}`);
      setActivities(response.data);
    } catch (error) {
      console.error('Failed to load activities. Please check your internet connectio or try again later', error);
    } finally {
      setLoading(false);
    }
  };

 

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'in-progress':
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'in-progress':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return '';
    }
  };
 useEffect(() => {
    fetchActivities();
  }, []);

  const openDetails = (activity) => {
    setSelectedActivity(activity);
    setIsEditing(false);
    setEditForm({
      title: activity.title || '',
      description: activity.description || '',
      rewardPoints: activity.rewardPoints ?? '',
      status: activity.status || 'pending'
    });
  };

  const closeDetails = () => {
    setSelectedActivity(null);
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedActivity || !currentUserId) return;
    try {
      setUpdating(true);
      if (editForm.status === 'completed') {
        await handleComplete(selectedActivity._id);
        return;
      }
      const payload = {
        userId: currentUserId,
        title: editForm.title,
        description: editForm.description,
        rewardPoints: Number(editForm.rewardPoints),
        status: editForm.status
      };
      const response = await axios.put(
        `http://localhost:5000/api/tasks/update/${selectedActivity._id}`,
        payload
      );
      setSelectedActivity((prev) => ({ ...prev, ...response.data }));
      await fetchActivities();
      setIsEditing(false);
      window.dispatchEvent(new Event('karma-updated'));
    } catch (error) {
      console.error('Failed to update activity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleComplete = async (activityId) => {
    try {
      setCompleting(true);
      await axios.put(`http://localhost:5000/api/tasks/complete/${activityId}`);
      await fetchActivities();
      closeDetails();
      window.dispatchEvent(new Event('karma-updated'));
    } catch (error) {
      console.error('Failed to complete activity:', error);
    } finally {
      setCompleting(false);
    }
  };

  const handleDelete = async (activityId) => {
    if (!currentUserId) return;
    const confirmed = window.confirm('Delete this activity? Points will be refunded if applicable.');
    if (!confirmed) return;
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:5000/api/tasks/delete/${activityId}`, {
        data: { userId: currentUserId }
      });
      setActivities((prev) => prev.filter((item) => item._id !== activityId));
      if (selectedActivity?._id === activityId) {
        closeDetails();
      }
      window.dispatchEvent(new Event('karma-updated'));
    } catch (error) {
      console.error('Failed to delete activity:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-slate-600">Loading your activity...</div>
      </div>
    );
  } else{
  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="inline-block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">Your History</span>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Activity</h1>
          <p className="text-slate-600 text-base">
            Track all your favors and activity history
          </p>
        </div>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="bg-white rounded-xl border border-slate-200 shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(activity.status)}
                    <h3 className="text-lg font-bold text-slate-900">{activity.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    <span className="font-semibold text-slate-900">{activity.requester?.name}</span>
                    <span className="text-slate-500"> • Room {activity.requester?.roomNo}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openDetails(activity)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {activity.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            openDetails(activity);
                            setIsEditing(true);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                        >
                          <Pencil className="w-4 h-4" />
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(activity._id)}
                          disabled={deleting}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </>
                    )}
                    {activity.status === 'in-progress' && (
                      <button
                        type="button"
                        onClick={() => openDetails(activity)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600 mb-2">+{activity.rewardPoints} pts</div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(activity.status)}`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Activity Details</h2>
                <p className="text-sm text-slate-500">Review or update your activity</p>
              </div>
              <button
                type="button"
                onClick={closeDetails}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {getStatusIcon(selectedActivity.status)}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedActivity.status)}`}>
                  {selectedActivity.status.charAt(0).toUpperCase() + selectedActivity.status.slice(1)}
                </span>
                <span className="text-sm font-semibold text-emerald-600">+{selectedActivity.rewardPoints} pts</span>
              </div>

              {!isEditing ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Title</p>
                    <p className="text-base font-semibold text-slate-900">{selectedActivity.title}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Description</p>
                    <p className="text-sm text-slate-700">{selectedActivity.description || 'No description provided.'}</p>
                  </div>
                  <div className="text-sm text-slate-600">
                    Requested by <span className="font-semibold text-slate-900">{selectedActivity.requester?.name}</span> (Room {selectedActivity.requester?.roomNo})
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-slate-500">Title</label>
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-slate-500">Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-slate-500">Reward Points</label>
                      <input
                        name="rewardPoints"
                        type="number"
                        min="0"
                        value={editForm.rewardPoints}
                        onChange={handleEditChange}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-slate-500">Status</label>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        disabled={selectedActivity.status !== 'pending'}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                {selectedActivity.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedActivity._id)}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedActivity.status === 'in-progress' && (
                  <button
                    type="button"
                    onClick={() => handleComplete(selectedActivity._id)}
                    disabled={completing}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Mark Completed
                  </button>
                )}
                {selectedActivity.status === 'pending' && (!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-600 text-white hover:bg-cyan-700"
                  >
                    <Pencil className="w-4 h-4" />
                    Update
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Save Changes
                  </button>
                ))}
                <button
                  type="button"
                  onClick={closeDetails}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
};
export default Activity;