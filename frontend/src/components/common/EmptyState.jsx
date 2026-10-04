import React from 'react';
import { Database } from 'lucide-react';

export const EmptyState = ({
  title = 'No resources found',
  description = 'There are no items matching your criteria in this environment.',
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Database className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
