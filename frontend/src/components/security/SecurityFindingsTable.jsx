import React from 'react';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const SecurityFindingsTable = ({ findings }) => {
  const columns = [
    {
      header: 'ID / Policy',
      accessor: 'id',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-slate-800">{row.id}</span>
          <div className="font-semibold text-xs text-slate-900 mt-0.5">{row.title}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Target Resource',
      accessor: 'resourceName',
      render: (row) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800">{row.resourceName}</span>
          <span className="block font-mono text-[10px] text-slate-400">{row.resourceId}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Description & Recommendation',
      accessor: 'description',
      render: (row) => (
        <div className="max-w-md text-xs">
          <p className="text-slate-700">{row.description}</p>
          <p className="text-slate-400 text-[11px] mt-1 font-mono">{row.recommendation}</p>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={findings} />;
};

export default SecurityFindingsTable;
