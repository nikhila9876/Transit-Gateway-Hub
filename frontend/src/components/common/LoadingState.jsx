import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading infrastructure resources...' }) => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Spinner & Message Banner */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
        <span className="text-xs font-semibold text-slate-700">{message}</span>
      </div>

      {/* Skeleton Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-200 rounded-md" />
              <div className="h-8 w-8 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-7 w-28 bg-slate-200 rounded-md" />
            <div className="h-3 w-36 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>

      {/* Skeleton Content Card / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="h-4 w-44 bg-slate-200 rounded-md" />
          <div className="h-4 w-24 bg-slate-100 rounded-md" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center gap-4 py-2 border-b border-slate-50">
              <div className="h-3.5 w-1/4 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-1/4 bg-slate-100 rounded-md" />
              <div className="h-3.5 w-1/6 bg-slate-100 rounded-md" />
              <div className="h-3.5 w-1/6 bg-slate-100 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
