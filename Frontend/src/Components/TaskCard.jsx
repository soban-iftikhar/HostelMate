import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

function TaskCard({ title, reward, requesterName, roomNumber, description }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = description && description.length > 140;
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
      <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md mt-auto">
        <CheckCircle className="w-5 h-5" />
        Accept Favor
      </button>
    </div>
  );
}

export default TaskCard;