import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Activity() {
  const activities = [
    {
      id: 1,
      title: 'Fix the Wi-Fi Router',
      requester: 'Jordan Smith',
      room: '302-B',
      reward: 20,
      status: 'completed',
      date: '2 days ago',
    },
    {
      id: 2,
      title: 'Help with Luggage',
      requester: 'Sarah Johnson',
      room: '405-A',
      reward: 15,
      status: 'completed',
      date: '5 days ago',
    },
    {
      id: 3,
      title: 'Recommend Local Restaurants',
      requester: 'Marcus Lee',
      room: '201-C',
      reward: 10,
      status: 'pending',
      date: '1 day ago',
    },
    {
      id: 4,
      title: 'Fix Broken Door Lock',
      requester: 'Emma Wilson',
      room: '312-A',
      reward: 25,
      status: 'completed',
      date: '1 week ago',
    },
    {
      id: 5,
      title: 'Share course notes',
      requester: 'Alex Kumar',
      room: '218-D',
      reward: 5,
      status: 'declined',
      date: '2 weeks ago',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'declined':
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
      case 'declined':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return '';
    }
  };

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
              key={activity.id}
              className="bg-white rounded-xl border border-slate-200 shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(activity.status)}
                    <h3 className="text-lg font-bold text-slate-900">{activity.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    <span className="font-semibold text-slate-900">{activity.requester}</span>
                    <span className="text-slate-500"> • Room {activity.room} • {activity.date}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600 mb-2">+{activity.reward} pts</div>
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
