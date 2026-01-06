import { useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import TaskCard from '../Components/TaskCard';
import Activity from './Activity';
import Leaderboard from './Leaderboard';

export default function Dashboard({ onLogout = null }) {
  const [activeNav, setActiveNav] = useState('available');

  const tasks = [
    {
      id: 1,
      title: 'Fix the Wi-Fi Router',
      reward: 20,
      requesterName: 'Jordan Smith',
      roomNumber: '302-B',
      description: 'The Wi-Fi in my room has been spotty. Can you help me reset it and check the connection?',
    },
    {
      id: 2,
      title: 'Help with Luggage',
      reward: 15,
      requesterName: 'Sarah Johnson',
      roomNumber: '405-A',
      description: 'Just arrived at the hostel. Need someone to help carry my bags up to my room.',
    },
    {
      id: 3,
      title: 'Recommend Local Restaurants',
      reward: 10,
      requesterName: 'Marcus Lee',
      roomNumber: '201-C',
      description: 'I\'m new to the area. Looking for good vegetarian restaurants nearby. Any recommendations?',
    },
    {
      id: 4,
      title: 'Fix Broken Door Lock',
      reward: 25,
      requesterName: 'Emma Wilson',
      roomNumber: '312-A',
      description: 'My door lock is jammed. Could use some help to get it working again.',
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Navbar */}
      <Navbar userName="Alex Chen" karmaPoints={140} onLogout={onLogout} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeNav={activeNav} onNavigate={setActiveNav} />

        {/* Content Area */}
        {activeNav === 'available' && (
          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <span className="inline-block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">Hostel Favors</span>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Available Favors</h1>
                <p className="text-slate-600 text-base">
                  Browse and accept favors from your hostel mates to earn karma points
                </p>
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    reward={task.reward}
                    requesterName={task.requesterName}
                    roomNumber={task.roomNumber}
                    description={task.description}
                  />
                ))}
              </div>
            </div>
          </main>
        )}

        {activeNav === 'activity' && <Activity />}
        {activeNav === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  );
}
