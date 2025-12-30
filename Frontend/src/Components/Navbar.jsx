import { LogOut, Zap } from 'lucide-react';

export default function Navbar({ userName = 'Alex Chen', karmaPoints = 140, onLogout = null }) {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          <div>
            <span className="block text-lg font-bold text-slate-900">Hostel-Mate</span>
            <span className="block text-xs text-slate-500 font-medium">Community Favors</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">Resident</p>
          </div>
          <div className="bg-cyan-600 hover:bg-cyan-700 transition-colors rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-sm font-bold text-white">{karmaPoints}</span>
            <span className="text-xs font-semibold text-cyan-100">PTS</span>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
