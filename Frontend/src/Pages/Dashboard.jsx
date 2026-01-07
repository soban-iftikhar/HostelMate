import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Dashboard({ onLogout = null }) {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Navbar */}
      <Navbar userName="Alex Chen" karmaPoints={140} onLogout={onLogout} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <Outlet />
      </div>
    </div>
  );
}
