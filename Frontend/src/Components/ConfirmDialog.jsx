import { AlertCircle, X } from 'lucide-react';

function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-slate-600">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition duration-200"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 transition duration-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
