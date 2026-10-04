import React from 'react';
import { useToast } from '../../hooks/useToast';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  const styleMap = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />,
      border: 'border-emerald-200 bg-white text-emerald-950',
      badge: 'bg-emerald-500',
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />,
      border: 'border-amber-200 bg-white text-amber-950',
      badge: 'bg-amber-500',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />,
      border: 'border-rose-200 bg-white text-rose-950',
      badge: 'bg-rose-500',
    },
    info: {
      icon: <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />,
      border: 'border-blue-200 bg-white text-blue-950',
      badge: 'bg-blue-500',
    },
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 pointer-events-none">
      {toasts.map((toast) => {
        const style = styleMap[toast.type] || styleMap.info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl min-w-[300px] max-w-md border text-xs font-semibold ${style.border} transition-all duration-200`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.badge}`} />
            {style.icon}
            <div className="flex-1 font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Dismiss toast notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
