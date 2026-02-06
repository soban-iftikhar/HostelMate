import { Heart, Activity, Trophy } from 'lucide-react';

export default function Sidebar({ activeNav = 'available', onNavigate = () => {} }) {
  const navItems = [
    { id: 'available', label: 'Available Favors', icon: Heart },
    { id: 'activity', label: 'My Activity', icon: Activity },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 h-screen sticky top-16">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
