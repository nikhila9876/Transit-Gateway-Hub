import React from 'react';
import {
  RefreshCw,
  Activity,
  ShieldAlert,
  Sparkles,
  LogIn,
  Clock,
} from 'lucide-react';

const ACTIVITIES = [
  {
    id: 1,
    title: 'AWS infrastructure synchronized',
    time: '2 minutes ago',
    icon: RefreshCw,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    type: 'sync',
  },
  {
    id: 2,
    title: 'Connectivity test completed',
    time: '8 minutes ago',
    icon: Activity,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    type: 'test',
  },
  {
    id: 3,
    title: 'Security scan completed',
    time: '15 minutes ago',
    icon: ShieldAlert,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    type: 'security',
  },
  {
    id: 4,
    title: 'AI network analysis generated',
    time: '21 minutes ago',
    icon: Sparkles,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    type: 'ai',
  },
  {
    id: 5,
    title: 'User login',
    time: '32 minutes ago',
    icon: LogIn,
    color: 'text-slate-600 bg-slate-100 border-slate-200',
    type: 'auth',
  },
];

export const RecentActivityTimeline = ({ activities }) => {
  const displayItems = Array.isArray(activities) && activities.length > 0
    ? activities.map((item, idx) => ({
        id: item.id || idx,
        title: item.action ? `${item.action.replace(/_/g, ' ')} (${item.resource || 'TGW'})` : (item.title || 'System Event'),
        time: item.timestamp || item.time || 'Recent',
        icon: item.action?.includes('SECURITY') ? ShieldAlert : item.action?.includes('CONNECTIVITY') ? Activity : RefreshCw,
        color: item.action?.includes('SECURITY') ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-blue-600 bg-blue-50 border-blue-200',
      }))
    : ACTIVITIES;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Log</span>
      </div>

      <div className="space-y-4">
        {displayItems.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="flex items-start gap-3 group">
              <div className={`p-2 rounded-xl border ${act.color} flex-shrink-0 transition-transform group-hover:scale-105`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-800">{act.title}</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{act.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityTimeline;
