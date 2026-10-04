import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { routeTableService } from '../services/routeTableService';
import { GitFork, Network, ChevronRight, Layers, ArrowRight } from 'lucide-react';

export const RouteTablesPage = () => {
  const [routeTables, setRouteTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVpc, setSelectedVpc] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedRt, setSelectedRt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRouteTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await routeTableService.getRouteTables();
      const safeData = Array.isArray(data)
        ? data.map((rt) => ({
            ...rt,
            associations: rt.associatedSubnets || rt.associations || [],
          }))
        : [];
      setRouteTables(safeData);
      if (safeData.length > 0) {
        setSelectedRt(safeData[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load route tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteTables();
  }, []);

  const safeRouteTables = Array.isArray(routeTables) ? routeTables : [];
  const filteredRouteTables = safeRouteTables.filter((rt) => {
    const s = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (rt.name ? rt.name.toLowerCase().includes(s) : false) ||
      (rt.id ? rt.id.toLowerCase().includes(s) : false) ||
      (rt.vpcName ? rt.vpcName.toLowerCase().includes(s) : false);

    const matchesVpc = selectedVpc === 'All' || rt.vpcName === selectedVpc;
    const matchesState = selectedState === 'All' || (rt.status || 'Active') === selectedState;

    return matchesSearch && matchesVpc && matchesState;
  });

  // Overview Table Columns (p2.txt: Route Table ID, VPC, Name, Routes, Associations, Status)
  const overviewColumns = [
    {
      header: 'Route Table ID',
      accessor: 'id',
      render: (row) => <span className="font-mono font-semibold text-xs text-blue-600">{row.id}</span>,
    },
    {
      header: 'VPC',
      accessor: 'vpcName',
      render: (row) => (
        <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
          {row.vpcName}
        </span>
      ),
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => <span className="font-semibold text-xs text-slate-900">{row.name}</span>,
    },
    {
      header: 'Routes',
      accessor: 'routes',
      render: (row) => (
        <span className="text-xs text-slate-700 font-mono">
          {row.routes?.length || 0} routes
        </span>
      ),
    },
    {
      header: 'Associations',
      accessor: 'associations',
      render: (row) => (
        <span className="text-xs text-slate-600">
          {row.associations?.length || 0} Subnets
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status || 'active'} text={row.status || 'Active'} />,
    },
  ];

  // Detail View Columns (p2.txt: Destination, Target, Type, State)
  const detailColumns = [
    {
      header: 'Destination',
      accessor: 'destination',
      render: (row) => <span className="font-mono font-bold text-xs text-blue-600">{row.destination}</span>,
    },
    {
      header: 'Target',
      accessor: 'target',
      render: (row) => (
        <span
          className={`font-mono text-xs px-2.5 py-1 rounded font-semibold ${
            row.target.includes('Enterprise-TGW')
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : row.target.includes('IGW')
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.target}
        </span>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
          {row.type || (row.target === 'local' ? 'Local' : row.target.includes('TGW') ? 'Transit Gateway' : 'Internet Gateway')}
        </span>
      ),
    },
    {
      header: 'State',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status || 'active'} text={row.status || 'Active'} />,
    },
  ];

  if (loading) return <LoadingState message="Fetching VPC route tables..." />;
  if (error) return <ErrorState message={error} onRetry={fetchRouteTables} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Route Tables"
        subtitle="Inspection of subnet routing rules directing cross-VPC packets toward Enterprise-TGW."
        breadcrumbs={[{ label: 'Network' }, { label: 'Route Tables' }]}
      />

      {/* Controls Bar: Search, VPC filter, State filter */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:max-w-sm">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search route tables by ID, name, or VPC..."
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* VPC Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">VPC:</span>
            <select
              value={selectedVpc}
              onChange={(e) => setSelectedVpc(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All VPCs</option>
              <option value="DEV">DEV</option>
              <option value="TEST">TEST</option>
              <option value="PROD">PROD</option>
            </select>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All States</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">VPC Route Tables Overview</h3>
          <span className="text-xs text-slate-400">Click a row to inspect routing rules below</span>
        </div>
        {filteredRouteTables.length > 0 ? (
          <DataTable
            columns={overviewColumns}
            data={filteredRouteTables}
            onRowClick={(row) => setSelectedRt(row)}
          />
        ) : (
          <EmptyState
            title="No route tables found"
            description="There are no route tables matching your search and filter criteria."
          />
        )}
      </div>

      {/* Detail View of Selected Route Table (As specified in p2.txt) */}
      {selectedRt && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <GitFork className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">{selectedRt.name} Detail View</h4>
                  <StatusBadge status="active" text="Active" />
                </div>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  {selectedRt.id} • Attached to {selectedRt.vpcName} ({selectedRt.vpcId})
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              Subnet Associations: <strong className="text-slate-800">{selectedRt.associations?.join(', ')}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Configured Subnet Routes
            </div>
            <DataTable columns={detailColumns} data={selectedRt.routes || []} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteTablesPage;
