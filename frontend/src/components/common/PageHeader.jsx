import React from 'react';
import Breadcrumb from './Breadcrumb';

export const PageHeader = ({ title, subtitle, breadcrumbs, actions }) => {
  return (
    <div className="mb-6">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
