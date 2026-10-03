import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import { ec2Service } from '../services/ec2Service';
import { Server, Terminal, Shield, CheckCircle2 } from 'lucide-react';

export const Ec2Page = () => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ec2Service.getInstances();
        setInstances(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const columns = [
    {
      header: 'Instance Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="font-mono text-slate-400 text-[10px]">{row.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'VPC Environment',
      accessor: 'environment',
      render: (row) => (
        <span className="font-semibold text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700">
          {row.environment}
        </span>
      ),
    },
    {
      header: 'Private IPv4 IP',
      accessor: 'privateIp',
      render: (row) => <span className="font-mono font-bold text-blue-600">{row.privateIp}</span>,
    },
    {
      header: 'Public IPv4 IP',
      accessor: 'publicIp',
      render: (row) => <span className="font-mono text-slate-500 text-xs">{row.publicIp}</span>,
    },
    {
      header: 'App Response (:8080)',
      accessor: 'serviceResponse',
      render: (row) => (
        <span className="font-mono text-xs bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
          "{row.serviceResponse}"
        </span>
      ),
    },
    {
      header: 'Administration Mode',
      accessor: 'sessionManagerEnabled',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium border border-emerald-200">
          <Terminal className="w-3 h-3" />
          <span>SSM Session Mgr</span>
        </span>
      ),
    },
    {
      header: 'State',
      accessor: 'state',
      render: (row) => <StatusBadge status={row.state} />,
    },
  ];

  if (loading) return <LoadingState message="Fetching EC2 instance inventory..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="EC2 Workload Instances"
        subtitle="Workload servers deployed across DEV, TEST, and PROD VPC subnets running private HTTP services."
        breadcrumbs={[{ label: 'Compute' }, { label: 'EC2 Instances' }]}
      />

      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>All 3 instances use AWS Systems Manager (SSM) Session Manager. SSH port 22 is disabled for enterprise hardening.</span>
        </div>
        <span className="font-mono text-[11px] text-emerald-700">LabInstanceProfile Attached</span>
      </div>

      <DataTable columns={columns} data={instances} />
    </div>
  );
};

export default Ec2Page;
