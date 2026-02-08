import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Available from '../Components/Available';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Available/>
        <Outlet />
      </div>
    </div>
  );
}
