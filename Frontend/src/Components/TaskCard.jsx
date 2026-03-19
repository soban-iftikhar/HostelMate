import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../services/apiClient';

function TaskCard({ taskId, title, reward, requesterName, roomNumber, description, onAcceptSuccess }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [notification, setNotification] = useState(null);
  const shouldTruncate = description && description.length > 140;

  const handleAccept = async () => {
    try {
      setAccepting(true);
      setNotification(null);

      await apiClient.put('/tasks/accept', {
        taskId: taskId
      });

      setNotification({ type: 'success', message: 'Favor accepted! Check Activity page.' });
      
      // Call parent callback to refresh the list after a short delay
      setTimeout(() => {
        if (onAcceptSuccess) {
          onAcceptSuccess();
        }
      }, 1500);
    } catch (error) {
      console.error('Failed to accept task:', error);
      setNotification({ type: 'error', message: error.response?.data?.message || 'Failed to accept task. Please try again.' });
    } finally {
      setAccepting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex h-full flex-col">
      {/* Title and Reward Badge */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <h3 className="text-lg font-bold text-slate-900 flex-1 leading-snug">{title}</h3>
        <div className="bg-cyan-600 rounded-lg px-3 py-2 flex-shrink-0 shadow-sm">
          <span className="text-sm font-bold text-white">+{reward} pts</span>
        </div>
      </div>

      {/* Requester Info */}
      <div className="mb-4 pb-4 border-b border-slate-200">
        <p className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">{requesterName}</span>
          <span className="text-slate-500"> • Room {roomNumber}</span>
        </p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p
          className="text-sm text-slate-600 leading-relaxed"
          style={
            !isExpanded && shouldTruncate
              ? {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }
              : undefined
          }
        >
          {description}
        </p>
        {shouldTruncate && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            {isExpanded ? 'See less' : 'See more'}
          </button>
        )}
      </div>

      {/* Accept Button */}
      <button 
        onClick={handleAccept}
        disabled={accepting}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md mt-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <CheckCircle className="w-5 h-5" />
        {accepting ? 'Accepting...' : 'Accept Favor'}
      </button>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-center gap-3 ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'} border rounded-lg shadow-lg p-4 min-w-[320px] max-w-md`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <p className="flex-1 text-sm font-medium">
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className="hover:opacity-70 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;