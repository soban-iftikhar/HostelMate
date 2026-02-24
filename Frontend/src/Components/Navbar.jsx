import { LogOut, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Consistency is key!

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Resident', karmaPoints: 0 });
  const [isLoading, setIsLoading] = useState(true);
 
  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) {
        navigate('/login');
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser._id; // MongoDB uses _id

      // Using Axios to match the rest of your project
      const response = await axios.get(`https://hostelmate-94en.onrender.com/api/users/profile/${userId}`);
      
      setUser({
        name: response.data.name,
        karmaPoints: response.data.karmaPoints
      });
      setIsLoading(false);
    } catch (err) {
      console.error('Navbar fetch error:', err);
      setIsLoading(false);
      // If the token/user is invalid, clear it and go to login
      if (err.response?.status === 404) navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  useEffect(() => {
    (async () => {
      await fetchUserData();
    })();

    const handleKarmaUpdate = () => {
      (async () => {
        await fetchUserData();
      })();
    };

    window.addEventListener('karma-updated', handleKarmaUpdate);
    return () => {
      window.removeEventListener('karma-updated', handleKarmaUpdate);
    };
  }, []);
  
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-cyan-600 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
            </div>
            <div className="hidden sm:block">
              <span className="block text-base sm:text-lg font-bold text-slate-900 leading-none">HostelMate</span>
              <span className="block text-[8px] sm:text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Karma Economy</span>
            </div>
          </div>

          {/* User Stats & Logout */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs sm:text-sm font-bold text-slate-900">{isLoading ? '...' : user.name}</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase">Active</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-full pl-2 sm:pl-4 pr-1 py-1 flex items-center gap-2 sm:gap-3 shadow-inner">
              <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-tighter">Karma</span>
              <div className="bg-cyan-500 text-white text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg whitespace-nowrap">
                {isLoading ? '--' : user.karmaPoints} PTS
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all group flex items-center gap-1 sm:gap-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;