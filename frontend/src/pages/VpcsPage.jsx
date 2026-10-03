import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import VpcDetailModal from '../components/network/VpcDetailModal';
import { vpcService } from '../services/vpcService';
import { Layers, Eye } from 'lucide-react';

export const VpcsPage = () => {
  const [vpcs, setVpcs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
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
      v.cidr.includes(searchTerm) ||
      v.id.includes(searchTerm);
    if (selectedFilter === 'All') return matchesSearch;
    return matchesSearch && v.name === selectedFilter;
  });

  const columns = [
    {
      header: 'Environment / VPC',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
            style={{ backgroundColor: row.color || '#3b82f6' }}
          >
            {row.name}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.displayName || row.name}</div>
            <div className="font-mono text-slate-400 text-[10px]">{row.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'IPv4 CIDR',
      accessor: 'cidr',
      render: (row) => <span className="font-mono font-medium text-slate-800">{row.cidr}</span>,
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
        <span className="inline-flex items-center gap-1 text-slate-700">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.subnetCount} Subnets</span>
        </span>
      ),
    },
    {
      header: 'EC2 Nodes',
      accessor: 'ec2Count',
      render: (row) => <span>{row.ec2Count} Instance</span>,
    },
    {
      header: 'TGW Attachment',
      accessor: 'attachmentStatus',
      render: (row) => <StatusBadge status={row.attachmentStatus} text={row.attachmentStatus} />,
    },
    {
      header: 'State',
      accessor: 'state',
      render: (row) => <StatusBadge status={row.state} />,
    },
    {
      header: 'Action',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedVpc(row);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect</span>
        </button>
      ),
    },
  ];

  if (loading) return <LoadingState message="Fetching VPC definitions..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="VPC Explorer"
        subtitle="Manage and inspect Virtual Private Clouds participating in the Transit Gateway Hub."
        breadcrumbs={[{ label: 'Network' }, { label: 'VPC Explorer' }]}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Filter by name, CIDR, or ID..." />
        <FilterBar
          options={['All', 'DEV', 'TEST', 'PROD']}
          activeFilter={selectedFilter}
          onSelect={setSelectedFilter}
        />
      </div>

      <DataTable columns={columns} data={filteredVpcs} />

      <VpcDetailModal
        vpc={selectedVpc}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default VpcsPage;
