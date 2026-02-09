import { NavLink } from 'react-router-dom';
import { Heart, Activity, Trophy, History as HistoryIcon } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { id: 'available', label: 'Available Favors', icon: Heart, to: '/dashboard' },
    { id: 'activity', label: 'My Activity', icon: Activity, to: '/dashboard/activity' },
    { id: 'history', label: 'History', icon: HistoryIcon, to: '/dashboard/history' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, to: '/dashboard/leaderboard' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-slate-50 border-r border-slate-200 h-screen sticky top-16">
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.id === 'available'}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.id === 'available'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-1 ${
                    isActive
                      ? 'text-cyan-600 bg-cyan-50'
                      : 'text-slate-600 hover:text-cyan-600'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium text-center">{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
