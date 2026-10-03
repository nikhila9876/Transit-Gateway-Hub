import React from 'react';
import { Activity, Clock } from 'lucide-react';

export const ActivityItem = ({ title, timestamp, description, user, status = 'SUCCESS' }) => {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Activity className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-800 truncate">{title}</p>
          <div className="flex items-center text-[10px] text-slate-400 gap-1 flex-shrink-0">
            <Clock className="w-3 h-3" />
            <span>{timestamp}</span>
          </div>
        </div>
        {description && <p className="text-xs text-slate-500 mt-0.5 break-words">{description}</p>}
        {user && <span className="inline-block mt-1 text-[10px] text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded">{user}</span>}
      </div>
    </div>
  );
};

export default ActivityItem;
