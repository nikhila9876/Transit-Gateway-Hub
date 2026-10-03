import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import { routeTableService } from '../services/routeTableService';
import { GitFork, Network } from 'lucide-react';

export const RouteTablesPage = () => {
  const [routeTables, setRouteTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await routeTableService.getRouteTables();
        setRouteTables(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const routeColumns = [
    {
      header: 'Destination CIDR',
      accessor: 'destination',
      render: (row) => <span className="font-mono font-semibold text-blue-600">{row.destination}</span>,
    },
    {
      header: 'Target Gateway / Hop',
      accessor: 'target',
      render: (row) => (
        <span
          className={`font-mono text-xs px-2 py-1 rounded ${
            row.target.includes('Enterprise-TGW')
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : row.target.includes('IGW')
              ? 'bg-amber-50 text-amber-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.target}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Propagated',
      accessor: 'propagated',
      render: (row) => <span className="text-slate-500 text-xs">{row.propagated}</span>,
    },
  ];

  if (loading) return <LoadingState message="Fetching VPC route tables..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="VPC Route Tables"
        subtitle="Inspection of subnet routing rules directing cross-VPC packets toward Enterprise-TGW."
        breadcrumbs={[{ label: 'Network' }, { label: 'Route Tables' }]}
      />

      <div className="space-y-6">
        {routeTables.map((rt) => (
          <div key={rt.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <GitFork className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{rt.name}</h3>
                  <div className="text-xs font-mono text-slate-500">
                    {rt.id} | Attached to {rt.vpcName} ({rt.vpcId})
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{rt.associations?.length || 0}</span> Subnet Associations
              </div>
            </div>

            <div className="p-4">
              <DataTable columns={routeColumns} data={rt.routes} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteTablesPage;
