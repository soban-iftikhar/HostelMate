import { Crown, Medal } from 'lucide-react';

export default function Leaderboard() {
  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      name: 'Priya Sharma',
      room: '410-A',
      points: 450,
      favors: 28,
      level: 'Pro Helper',
    },
    {
      id: 2,
      rank: 2,
      name: 'Arjun Patel',
      room: '305-C',
      points: 385,
      favors: 24,
      level: 'Experienced',
    },
    {
      id: 3,
      rank: 3,
      name: 'Zara Khan',
      room: '202-B',
      points: 340,
      favors: 21,
      level: 'Experienced',
    },
    {
      id: 4,
      rank: 4,
      name: 'Marco Torres',
      room: '315-D',
      points: 295,
      favors: 18,
      level: 'Helpful',
    },
    {
      id: 5,
      rank: 5,
      name: 'Lily Chen',
      room: '208-A',
      points: 260,
      favors: 16,
      level: 'Helpful',
    },
    {
      id: 6,
      rank: 6,
      name: 'Mohammed Ali',
      room: '412-B',
      points: 225,
      favors: 14,
      level: 'Active',
    },
    {
      id: 7,
      rank: 7,
      name: 'Elena Rodriguez',
      room: '301-A',
      points: 190,
      favors: 11,
      level: 'Active',
    },
    {
      id: 8,
      rank: 8,
      name: 'Akira Tanaka',
      room: '206-C',
      points: 155,
      favors: 9,
      level: 'Beginner',
    },
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-600" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return null;
  };

  const getRankBgColor = (rank) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-slate-50 border-slate-200';
    if (rank === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-slate-200';
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Pro Helper':
        return 'bg-cyan-100 text-cyan-700';
      case 'Experienced':
        return 'bg-emerald-100 text-emerald-700';
      case 'Helpful':
        return 'bg-blue-100 text-blue-700';
      case 'Active':
        return 'bg-purple-100 text-purple-700';
      case 'Beginner':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="inline-block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">Rankings</span>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Leaderboard</h1>
          <p className="text-slate-600 text-base">
            See who's helping the most in your hostel community
          </p>
        </div>

        <div className="space-y-3">
          {leaderboardData.map((user) => (
            <div
              key={user.id}
              className={`rounded-xl border shadow-md p-5 hover:shadow-lg transition-shadow duration-300 flex items-center justify-between gap-6 ${getRankBgColor(user.rank)}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-slate-200 font-bold text-lg text-slate-900">
                  {user.rank <= 3 ? (
                    getRankIcon(user.rank)
                  ) : (
                    <span>#{user.rank}</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-500">Room {user.room} • {user.favors} favors</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{user.points}</p>
                  <p className="text-xs text-slate-500 font-medium">points</p>
                </div>

                <span className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${getLevelColor(user.level)}`}>
                  {user.level}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-cyan-50 border border-cyan-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">How it works</h3>
          <ul className="text-sm text-slate-700 space-y-2">
            <li>• Earn points by accepting and completing favors</li>
            <li>• Reach milestones to unlock new levels</li>
            <li>• Gain recognition in your hostel community</li>
            <li>• Build a trusted reputation as a helper</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
