import React from 'react';
import {
  Layers,
  Share2,
  Network,
  Server,
  Activity,
  ShieldCheck,
  Zap,
  Gauge,
  Lock,
  AlertTriangle,
} from 'lucide-react';

const ICON_MAP = {
  Layers,
  Share2,
  Network,
  Server,
  Activity,
  ShieldCheck,
  Zap,
  Gauge,
  Lock,
  AlertTriangle,
};

export const StatCard = ({
  title,
  value,
  subvalue,
  icon: iconName,
  color = 'blue',
  trend,
  trendDirection = 'neutral'
}) => {
  const IconComponent = ICON_MAP[iconName] || Activity;

  const colorVariants = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
    green: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
    },
    cyan: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
      border: 'border-cyan-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    red: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    }
  };

  const currentTheme = colorVariants[color] || colorVariants.blue;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${
              trendDirection === 'up'
                ? 'text-emerald-700 bg-emerald-50'
                : trendDirection === 'down'
                ? 'text-rose-700 bg-rose-50'
                : 'text-slate-600 bg-slate-50'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      {subvalue && <div className="mt-1 text-xs text-slate-500">{subvalue}</div>}
    </div>
  );
};

export default StatCard;
