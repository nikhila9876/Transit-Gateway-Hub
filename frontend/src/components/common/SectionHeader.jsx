import React from 'react';

export const SectionHeader = ({ title, description, badge, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {badge && <span>{badge}</span>}
        </div>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHeader;
