import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { ec2Service } from '../services/ec2Service';
import { Server, Terminal, Shield, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const Ec2Page = () => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInstances = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ec2Service.getInstances();
      setInstances(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load EC2 instances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  // Columns strictly matching p2.txt:
  // Instance Name, Instance ID, State, Private IP, Public IP, VPC, Subnet, Instance Type, Health
  const columns = [
    {
      header: 'Instance Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-2xs">
            <Server className="w-4 h-4" />
          </div>
          <div className="font-semibold text-slate-900 text-xs">{row.name}</div>
        </div>
      ),
    },
    {
      header: 'Instance ID',
      accessor: 'id',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.id}</span>,
    },
    {
      header: 'State',
      accessor: 'state',
      render: (row) => {
        const isRunning = row.state === 'running' || row.state === 'available';
        const isPending = row.state === 'pending' || row.state === 'stopping';
        const colorClass = isRunning
          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
          : isPending
          ? 'text-amber-700 bg-amber-50 border-amber-200'
          : 'text-rose-700 bg-rose-50 border-rose-200';
        const dotColor = isRunning ? 'bg-emerald-500' : isPending ? 'bg-amber-500' : 'bg-rose-500';

        return (
          <span className={`inline-flex items-center gap-1.5 border px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
            <span className="capitalize">{row.state}</span>
          </span>
        );
      },
    },
    {
      header: 'Private IP',
      accessor: 'privateIp',
      render: (row) => <span className="font-mono font-bold text-xs text-blue-600">{row.privateIp}</span>,
    },
    {
      header: 'Public IP',
      accessor: 'publicIp',
      render: (row) => (
        <span className="font-mono text-xs text-slate-600">
          {row.publicIp || 'None (Private)'}
        </span>
      ),
    },
    {
      header: 'VPC',
      accessor: 'environment',
      render: (row) => (
        <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
          {row.environment || row.vpcName}
        </span>
      ),
    },
    {
      header: 'Subnet',
      accessor: 'subnetId',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.subnetId}</span>,
    },
    {
      header: 'Instance Type',
      accessor: 'instanceType',
      render: (row) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">{row.instanceType || 't3.micro'}</span>,
    },
    {
      header: 'Health',
      accessor: 'health',
      render: (row) => {
        const isHealthy = row.health === 'Healthy' || !row.health;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isHealthy
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isHealthy ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>{row.health || 'Healthy'}</span>
          </span>
        );
      },
    },
  ];

  if (loading) return <LoadingState message="Fetching EC2 instance inventory..." />;
  if (error) return <ErrorState message={error} onRetry={fetchInstances} />;

  const safeInstances = Array.isArray(instances) ? instances : [];
  const runningCount = safeInstances.filter((i) => i.state === 'running').length;
  const stoppedCount = safeInstances.filter((i) => i.state === 'stopped').length;
  const healthIssuesCount = safeInstances.filter((i) => i.health && i.health !== 'Healthy').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="EC2 Instances"
        subtitle="Workload servers deployed across DEV, TEST, and PROD VPC subnets running private HTTP services."
        breadcrumbs={[{ label: 'Compute' }, { label: 'EC2 Instances' }]}
      />

      {/* Top Metrics Cards (Total, Running, Stopped, Health Issues as specified in p2.txt) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total"
          value={safeInstances.length}
          subvalue="Provisioned EC2 Fleet"
          icon="Server"
          color="blue"
        />
        <StatCard
          title="Running"
          value={runningCount}
          subvalue={runningCount === safeInstances.length && safeInstances.length > 0 ? "100% Operational" : `${runningCount} of ${safeInstances.length} online`}
          icon="Activity"
          color="green"
        />
        <StatCard
          title="Stopped"
          value={stoppedCount}
          subvalue={stoppedCount > 0 ? `${stoppedCount} stopped instances` : "No stopped instances"}
          icon="Server"
          color="slate"
        />
        <StatCard
          title="Health Issues"
          value={healthIssuesCount}
          subvalue={healthIssuesCount > 0 ? `${healthIssuesCount} Node(s) Require Review` : "0 Health Issues"}
          icon="AlertTriangle"
          color={healthIssuesCount > 0 ? "amber" : "green"}
        />
      </div>

      {/* Security Baseline Banner */}
      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Enterprise Security Hardening: Inbound SSH Port 22 is disabled across all instances. Administrative access is managed exclusively via AWS Systems Manager (SSM) Session Manager.
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200">
          <Terminal className="w-3.5 h-3.5" />
          <span>SSM Agent Active</span>
        </div>
      </div>

      {/* Instances Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Workload Instances Fleet</h3>
          <span className="text-xs text-slate-400">HTTP service bound to port 8080</span>
        </div>
        {safeInstances.length > 0 ? (
          <DataTable columns={columns} data={safeInstances} />
        ) : (
          <EmptyState
            title="No EC2 instances found"
            description="No workload instances were found in the connected VPC environments."
          />
        )}
      </div>
    </div>
  );
};

export default Ec2Page;
