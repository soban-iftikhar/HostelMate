import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState, useEffect} from 'react';
import axios from 'axios';

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = currentUser ? currentUser._id : null;

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
    </div>
  );
}
};
export default Activity;