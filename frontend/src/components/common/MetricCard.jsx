import React from 'react';

export const MetricCard = ({ label, value, unit, change, changeType = 'positive' }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-lg font-semibold text-slate-900">{value}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      {change && (
        <div
          className={`text-xs mt-1 ${
            changeType === 'positive'
              ? 'text-emerald-600'
              : changeType === 'negative'
              ? 'text-rose-600'
              : 'text-slate-500'
          }`}
        >
          {change}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
