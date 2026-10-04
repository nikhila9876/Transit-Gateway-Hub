import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { transitGatewayService } from '../services/transitGatewayService';
import { Share2, Network, GitFork, Route, CheckCircle, ArrowRight } from 'lucide-react';

export const TransitGatewayPage = () => {
  const [tgw, setTgw] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTgwData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tgwRes, attachRes, routeRes] = await Promise.all([
        transitGatewayService.getTransitGateway(),
        transitGatewayService.getAttachments(),
        transitGatewayService.getRoutes(),
      ]);
      setTgw(tgwRes);
      setAttachments(Array.isArray(attachRes) ? attachRes : tgwRes?.attachments || []);
      setRoutes(Array.isArray(routeRes) ? routeRes : tgwRes?.routes || []);
    } catch (err) {
      setError(err.message || 'Failed to load Transit Gateway information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTgwData();
  }, []);

  const attachmentColumns = [
    {
      header: 'Attachment',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="font-mono text-slate-400 text-[10px]">{row.id}</div>
        </div>
      ),
    },
    {
      header: 'VPC',
      accessor: 'vpcName',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800">{row.vpcName}</span>
          <span className="block font-mono text-[10px] text-slate-500">{row.vpcId}</span>
        </div>
      ),
    },
    {
      header: 'State',
      accessor: 'state',
      render: (row) => <StatusBadge status={row.state} text={row.state} />,
    },
    {
      header: 'Subnet',
      accessor: 'subnetIds',
      render: (row) => (
        <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {row.subnetIds?.[0] || row.subnetId || 'Direct'}
        </span>
      ),
    },
    {
      header: 'Association',
      accessor: 'associationState',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span className="capitalize">{row.associationState || 'Associated'}</span>
        </span>
      ),
    },
  ];

  const routeColumns = [
    {
      header: 'Destination',
      accessor: 'destinationCidr',
      render: (row) => <span className="font-mono font-semibold text-blue-600">{row.destinationCidr}</span>,
    },
    {
      header: 'Target',
      accessor: 'targetName',
      render: (row) => (
        <div>
          <span className="font-medium text-slate-800">{row.targetName}</span>
          <span className="block font-mono text-[10px] text-slate-400">{row.targetAttachmentId}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => <span className="capitalize text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs">{row.type}</span>,
    },
    {
      header: 'State',
      accessor: 'state',
      render: (row) => <StatusBadge status={row.state} text={row.state} />,
    },
  ];

  if (loading) return <LoadingState message="Loading Transit Gateway Hub topology..." />;
  if (error) return <ErrorState message={error} onRetry={fetchTgwData} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transit Gateway"
        subtitle="Centralized network router interconnecting DEV, TEST, and PROD VPC attachments."
        breadcrumbs={[{ label: 'Network' }, { label: 'Transit Gateway' }]}
      />

      {/* Main Gateway Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{tgw?.name || 'Enterprise-TGW'}</h2>
                <StatusBadge status="available" text="Available" />
              </div>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                {tgw?.id || 'tgw-09e8712a34bc56df0'} • Region: <strong className="text-slate-700">{tgw?.region || 'us-east-1'}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">BGP ASN:</span>
            <span className="font-mono font-bold text-slate-800">{tgw?.asn || 64512}</span>
          </div>
        </div>

        {/* 4 Metric Cards (Connected VPCs, Attachments, Route Tables, Routes) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard
            title="Connected VPCs"
            value={attachments.length}
            subvalue={`${attachments.length} Discovered Attachments`}
            icon="Layers"
            color="blue"
          />
          <StatCard
            title="Attachments"
            value={attachments.length}
            subvalue={attachments.every(a => a.state === 'available') ? "100% Associated" : "Attachments active"}
            icon="Network"
            color="indigo"
          />
          <StatCard
            title="Route Tables"
            value={tgw?.routeTableCount ?? (routes.length > 0 ? 3 : 1)}
            subvalue="Subnet propagation"
            icon="GitFork"
            color="cyan"
          />
          <StatCard
            title="Routes"
            value={routes.length}
            subvalue={routes.length > 0 ? "Cross-VPC active routes" : "No propagated routes"}
            icon="Activity"
            color="green"
          />
        </div>
      </div>

      {/* Tabs: Overview, Attachments, Routes (As specified in p2.txt) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-6 pt-3 gap-6 text-xs font-semibold">
          {['Overview', 'Attachments', 'Routes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab} {tab === 'Attachments' ? `(${attachments.length || tgw?.attachments?.length || 0})` : tab === 'Routes' ? `(${routes.length || tgw?.routes?.length || 0})` : ''}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Transit Gateway Feature Configuration</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {tgw?.description ||
                    'Central Enterprise Transit Gateway Hub interconnecting DEV, TEST, and PROD VPCs in us-east-1.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
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

              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900">
                <span className="font-bold block mb-1">Dynamic Route Propagation</span>
                <span>
                  All three spoke VPCs automatically propagate their <code>/16</code> CIDR blocks to the Enterprise-TGW route table. Return traffic routes are configured in each VPC subnet route table.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: ATTACHMENTS TABLE */}
          {activeTab === 'Attachments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">VPC Attachments</h4>
                  <p className="text-xs text-slate-500">Dedicated network interface attachments linking spoke VPCs to the hub.</p>
                </div>
              </div>
              <DataTable columns={attachmentColumns} data={attachments.length > 0 ? attachments : (tgw?.attachments || [])} />
            </div>
          )}

          {/* TAB 3: ROUTES TABLE */}
          {activeTab === 'Routes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Transit Gateway Route Table</h4>
                  <p className="text-xs text-slate-500">Global hub routing rules across all attached CIDR blocks.</p>
                </div>
              </div>
              <DataTable columns={routeColumns} data={routes.length > 0 ? routes : (tgw?.routes || [])} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransitGatewayPage;
