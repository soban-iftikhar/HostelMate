import { Crown, Medal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import apiClient from '../services/apiClient';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      case 'Legend':
        return 'bg-cyan-100 text-cyan-700';
      case 'Champion':
        return 'bg-emerald-100 text-emerald-700';
      case 'Helper':
        return 'bg-blue-100 text-blue-700';
      case 'Contributor':
        return 'bg-purple-100 text-purple-700';
      case 'Newcomer':
        return 'bg-slate-100 text-slate-700';
      case 'Starter':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getLevelFromPoints = (points) => {
    // Default starting points = 100
    if (points >= 400) return 'Legend';
    if (points >= 250) return 'Champion';
    if (points >= 180) return 'Helper';
    if (points >= 130) return 'Contributor';
    if (points >= 50) return 'Newcomer';
    return 'Newbie';
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/users/leaderboard');
        setLeaderboardData(response.data || []);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const rankedData = useMemo(() => {
    return leaderboardData.map((user, index) => ({
      id: user._id,
      rank: index + 1,
      name: user.name,
      room: user.roomNo,
      points: user.karmaPoints ?? 0,
      level: getLevelFromPoints(user.karmaPoints ?? 0),
    }));
  }, [leaderboardData]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-slate-600">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-center">
        <p className="text-rose-600 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-cyan-600 hover:underline font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <span className="inline-block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">Rankings</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">Leaderboard</h1>
          <p className="text-slate-600 text-sm sm:text-base">
            See who's helping the most in your hostel community
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {rankedData.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 text-slate-500 text-sm">
              No leaderboard data yet.
            </div>
          ) : (
            <>
              {/* Header Row - Hidden on Mobile */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                <div className="col-span-1"></div>
                <div className="col-span-6 font-bold">Name</div>
                <div className="col-span-2 text-center font-bold">Points</div>
                <div className="col-span-3 text-right pr-3 font-bold">Rank</div>
              </div>

              {/* Ranking Rows */}
              {rankedData.map((user) => (
                <div
                  key={user.id}
                  className={`rounded-xl border shadow-md p-4 sm:p-5 hover:shadow-lg transition-shadow duration-300 ${getRankBgColor(user.rank)}`}
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 font-bold text-base text-slate-900 flex-shrink-0">
                        {user.rank <= 3 ? (
                          getRankIcon(user.rank)
                        ) : (
                          <span>#{user.rank}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 truncate">{user.name}</h3>
                        <p className="text-xs text-slate-500">Room {user.room}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-slate-900">{user.points}</p>
                        <p className="text-xs text-slate-500 font-medium">points</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${getLevelColor(user.level)}`}>
                        {user.level}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-slate-200 font-bold text-lg text-slate-900">
                        {user.rank <= 3 ? (
                          getRankIcon(user.rank)
                        ) : (
                          <span>#{user.rank}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-span-6">
                      <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                      <p className="text-sm text-slate-500">Room {user.room}</p>
                    </div>

                    <div className="col-span-2 text-center">
                      <p className="text-2xl font-bold text-slate-900">{user.points}</p>
                      <p className="text-xs text-slate-500 font-medium">points</p>
                    </div>

                    <div className="col-span-3 flex items-center justify-end pr-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${getLevelColor(user.level)}`}>
                        {user.level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">How it works</h3>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
              <li>• Earn points by accepting and completing favors</li>
              <li>• Reach milestones to unlock new levels</li>
              <li>• Gain recognition in your hostel community</li>
              <li>• Build a trusted reputation as a helper</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">Level Scale</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-cyan-700">Legend</span>
                <span className="text-slate-600 text-right">400+ pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-700">Champion</span>
                <span className="text-slate-600">250–399 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-700">Helper</span>
                <span className="text-slate-600">180–249 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-purple-700">Contributor</span>
                <span className="text-slate-600">130–179 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Newcomer</span>
                <span className="text-slate-600">50–129 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-700">Starter</span>
                <span className="text-slate-600">0–49 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
