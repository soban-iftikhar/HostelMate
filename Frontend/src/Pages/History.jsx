import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchHistory = async () => {
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = currentUser ? currentUser._id : null;
    setCurrentUserId(userId);

    try {
      const response = await axios.get(`https://hostelmate-94en.onrender.com/api/tasks/history/${userId}`);
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-slate-600">Loading your history...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Completed</span>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">History</h1>
          <p className="text-slate-600 text-base">
            All favors you have completed or requested
          </p>
        </div>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-slate-500">
              No completed tasks yet.
            </div>
          ) : (
            history.map((item) => {
              // Check if current user is the requester (posted the task) or helper (completed the task)
              const isRequester = item.requester?._id === currentUserId;
              const pointsColor = isRequester ? 'text-rose-600' : 'text-emerald-600';
              const pointsSign = isRequester ? '-' : '+';
              
              return (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-slate-200 shadow-md p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      <span className="font-semibold text-slate-900">{item.requester?.name}</span>
                      <span className="text-slate-500"> • Room {item.requester?.roomNo}</span>
                    </p>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold mb-2 ${pointsColor}`}>
                      {pointsSign}{item.rewardPoints} pts
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            );})
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
