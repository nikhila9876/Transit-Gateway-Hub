import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import VpcDetailModal from '../components/network/VpcDetailModal';
import { vpcService } from '../services/vpcService';
import { Layers, Server, Eye, Filter } from 'lucide-react';

export const VpcsPage = () => {
  const [vpcs, setVpcs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEnv, setSelectedEnv] = useState('All');
  const [selectedVpc, setSelectedVpc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await vpcService.getVpcs();
        setVpcs(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredVpcs = vpcs.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.cidr.includes(searchTerm) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || v.region === selectedRegion;
    const matchesStatus = selectedStatus === 'All' || (v.status || 'Healthy') === selectedStatus;
    const matchesEnv = selectedEnv === 'All' || v.name === selectedEnv;

    return matchesSearch && matchesRegion && matchesStatus && matchesEnv;
  });

  const columns = [
    {
      header: 'Name',
      accessor: 'displayName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-2xs"
            style={{ backgroundColor: row.color || '#3b82f6' }}
          >
            {row.name}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.displayName || row.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{row.name} Environment</div>
          </div>
        </div>
      ),
    },
    {
      header: 'VPC ID',
      accessor: 'id',
      render: (row) => <span className="font-mono text-xs text-slate-600">{row.id}</span>,
    },
    {
      header: 'CIDR',
      accessor: 'cidr',
      render: (row) => <span className="font-mono font-semibold text-blue-600">{row.cidr}</span>,
    },
    {
      header: 'State',
      accessor: 'state',
      render: (row) => <StatusBadge status={row.state} text={row.state} />,
    },
    {
      header: 'Region',
      accessor: 'region',
      render: (row) => <span className="text-slate-600 font-mono text-xs">{row.region}</span>,
    },
    {
      header: 'Subnets',
      accessor: 'subnetCount',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-slate-700 text-xs">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.subnetCount} Subnets</span>
        </span>
      ),
    },
    {
      header: 'EC2',
      accessor: 'ec2Count',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-slate-700 text-xs">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.ec2Count} Node</span>
        </span>
      ),
    },
    {
      header: 'TGW Attachment',
      accessor: 'attachmentStatus',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.attachmentStatus || 'Attached'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <StatusBadge
          status={row.status === 'Warning' ? 'warning' : 'healthy'}
          text={row.status || 'Healthy'}
        />
      ),
    },
  ];

  if (loading) return <LoadingState message="Fetching VPC definitions..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="VPC Explorer"
        subtitle="Explore connected AWS Virtual Private Clouds."
        breadcrumbs={[{ label: 'Network' }, { label: 'VPC Explorer' }]}
      />

      {/* Controls Bar: Search, Region, Status, Environment */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="w-full lg:max-w-sm">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search VPCs by name, CIDR, or ID..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Region Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            >
              <option value="All">All Regions</option>
              <option value="us-east-1">us-east-1 (N. Virginia)</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
            </select>
          </div>

          {/* Environment Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Environment:</span>
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            >
              <option value="All">All Environments</option>
              <option value="DEV">DEV</option>
              <option value="TEST">TEST</option>
              <option value="PROD">PROD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Table with Row Click */}
      <div className="cursor-pointer">
        <DataTable
          columns={columns}
          data={filteredVpcs}
          onRowClick={(row) => {
            setSelectedVpc(row);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* VPC Detail Modal */}
      <VpcDetailModal
        vpc={selectedVpc}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default VpcsPage;
