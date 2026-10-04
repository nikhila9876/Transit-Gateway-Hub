import React from 'react';
import { STATUS_COLORS } from '../../utils/formatters';

export const StatusBadge = ({ status, text, size = 'sm' }) => {
  const normalized = (status || '').toLowerCase();
  const colorClass = STATUS_COLORS[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colorClass} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {text || status}
    </span>
  );
};

export default StatusBadge;
