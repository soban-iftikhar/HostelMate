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
    <aside className="w-64 bg-slate-50 border-r border-slate-200 h-screen sticky top-16">
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
  );
}
