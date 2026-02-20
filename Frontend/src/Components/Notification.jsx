import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

function Notification({ type = 'success', message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />
    },
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />
    },
    info: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      text: 'text-cyan-800',
      icon: <AlertCircle className="w-5 h-5 text-cyan-600" />
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
      <div className={`flex items-center gap-3 ${style.bg} ${style.border} border rounded-lg shadow-lg p-4 min-w-[320px] max-w-md`}>
        {style.icon}
        <p className={`flex-1 text-sm font-medium ${style.text}`}>
          {message}
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Notification;
