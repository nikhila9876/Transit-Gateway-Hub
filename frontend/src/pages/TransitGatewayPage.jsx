import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import SectionHeader from '../components/common/SectionHeader';
import { transitGatewayService } from '../services/transitGatewayService';
import { Share2, Network, ShieldCheck, CheckCircle } from 'lucide-react';

export const TransitGatewayPage = () => {
  const [tgw, setTgw] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await transitGatewayService.getTransitGateway();
        setTgw(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const attachmentColumns = [
    {
      header: 'Attachment Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="font-mono text-slate-400 text-[10px]">{row.id}</div>
        </div>
      ),
    },
    {
      header: 'VPC Target',
      accessor: 'vpcName',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800">{row.vpcName}</span>
          <span className="block font-mono text-[10px] text-slate-500">{row.vpcId}</span>
        </div>
      ),
    },
    {
      header: 'Resource Type',
      accessor: 'resourceType',
      render: (row) => <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">{row.resourceType}</span>,
    },
    {
      header: 'Association State',
      accessor: 'associationState',
      render: (row) => <StatusBadge status={row.associationState} />,
    },
    {
      header: 'State',
      accessor: 'state',
      render: (row) => <StatusBadge status={row.state} />,
    },
  ];

  const routeColumns = [
    {
      header: 'Destination CIDR Block',
      accessor: 'destinationCidr',
      render: (row) => <span className="font-mono font-semibold text-blue-600">{row.destinationCidr}</span>,
    },
    {
      header: 'Target Attachment',
      accessor: 'targetName',
      render: (row) => (
        <div>
          <span className="font-medium text-slate-800">{row.targetName}</span>
          <span className="block font-mono text-[10px] text-slate-400">{row.targetAttachmentId}</span>
        </div>
      ),
    },
    {
      header: 'Route Type',
      accessor: 'type',
      render: (row) => <span className="capitalize text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs">{row.type}</span>,
    },
    {
      header: 'State',
      accessor: 'state',
      render: (row) => <StatusBadge status={row.state} />,
    },
  ];

  if (loading) return <LoadingState message="Loading Transit Gateway Hub topology..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AWS Transit Gateway Hub"
        subtitle="Centralized network router interconnecting DEV, TEST, and PROD VPC attachments."
        breadcrumbs={[{ label: 'Network' }, { label: 'Transit Gateway' }]}
      />

      {/* Main Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{tgw?.name}</h2>
                <StatusBadge status={tgw?.state} />
              </div>
              <p className="font-mono text-xs text-slate-400 mt-0.5">{tgw?.id} | {tgw?.region}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">BGP Autonomous System Number:</span>
            <span className="font-mono font-bold text-slate-800">{tgw?.asn}</span>
          </div>
        </div>

        {/* Feature Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block mb-1">DNS Support</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Enabled
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block mb-1">VPN ECMP Support</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Enabled
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block mb-1">Auto-Accept Attachments</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Enabled
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block mb-1">Default Propagation</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Attachments Table */}
      <div className="space-y-3">
        <SectionHeader
          title="VPC Attachments (Spokes)"
          description="Dedicated attachments linking each isolated VPC into the central routing plane."
        />
        <DataTable columns={attachmentColumns} data={tgw?.attachments || []} />
      </div>

      {/* Transit Gateway Route Table */}
      <div className="space-y-3">
        <SectionHeader
          title="Transit Gateway Route Table"
          description="Global routing table propagating routes across all attached VPC CIDR blocks."
        />
        <DataTable columns={routeColumns} data={tgw?.routes || []} />
      </div>
    </div>
  );
};

export default TransitGatewayPage;
