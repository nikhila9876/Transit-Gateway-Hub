import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronRight } from 'lucide-react';

export const AlertCard = ({ title, description, severity = 'info', action, onAction }) => {
  const styles = {
    critical: {
      border: 'border-rose-200',
      bg: 'bg-rose-50/50',
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
      title: 'text-rose-900',
      desc: 'text-rose-700'
    },
    warning: {
      border: 'border-amber-200',
      bg: 'bg-amber-50/50',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      title: 'text-amber-900',
      desc: 'text-amber-700'
    },
    info: {
      border: 'border-blue-200',
      bg: 'bg-blue-50/50',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      title: 'text-blue-900',
      desc: 'text-blue-700'
    },
    healthy: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/50',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      title: 'text-emerald-900',
      desc: 'text-emerald-700'
    }
  };

  const current = styles[severity] || styles.info;

  return (
    <div className={`p-4 rounded-xl border ${current.border} ${current.bg} flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">{current.icon}</div>
      <div className="flex-1">
        <h4 className={`text-xs font-semibold ${current.title}`}>{title}</h4>
        <p className={`text-xs mt-0.5 ${current.desc}`}>{description}</p>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 self-center"
        >
          {action}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default AlertCard;
