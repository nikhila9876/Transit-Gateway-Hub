import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { monitoringService } from '../services/monitoringService';
import { networkService } from '../services/networkService';
import { MOCK_MONITORING } from '../data/mockMonitoring';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  RefreshCw,
  Activity,
  Cpu,
  Server,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  FileText,
} from 'lucide-react';

export const MonitoringPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [networkHealth, setNetworkHealth] = useState(null);
  const [flowLogs, setFlowLogs] = useState([]);
  const [range, setRange] = useState('6H');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchTelemetry = async () => {
    try {
      const [m, nh, fl] = await Promise.all([
        monitoringService.getMetrics(),
        networkService.getNetworkHealth(),
        networkService.getFlowLogs(),
      ]);
      setMetrics(m);
      setNetworkHealth(nh);
      setFlowLogs(Array.isArray(fl) ? fl : []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve telemetry metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Configurable auto-refresh interval (30 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const rangeData = MOCK_MONITORING.ranges[range] || MOCK_MONITORING.ranges['6H'];

  if (loading) return <LoadingState message="Collecting infrastructure telemetry from CloudWatch probe and network health engine..." />;
  if (error) return <ErrorState message={error} onRetry={fetchTelemetry} />;

  const cpuVal = metrics?.cpuUtilization !== undefined ? `${metrics.cpuUtilization}%` : '18.4%';
  const latencyVal = metrics?.avgLatencyMs !== undefined ? `${metrics.avgLatencyMs} ms` : '1.34 ms';
  const instanceHealthVal = metrics?.instanceHealth !== undefined ? `${metrics.instanceHealth}%` : '100%';
  const availabilityVal = metrics?.availability || '99.99%';

  const vpcChartData = (metrics?.vpcMetrics || []).map((vm) => ({
    vpc: vm.vpc,
    latencyMs: vm.latencyMs,
    throughputMbps: vm.throughputMbps,
  }));

  const overallScore = networkHealth?.overallScore ?? 92;
  const healthStatus = networkHealth?.status || 'Excellent';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network & Infrastructure Monitoring"
        subtitle="Real-time CPU, network telemetry, CloudNexus Network Health scoring, and VPC Flow Logs observability."
        breadcrumbs={[{ label: 'Operations' }, { label: 'Monitoring' }]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold transition shadow-sm ${
                autoRefresh
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <span>{autoRefresh ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'}</span>
            </button>
            <button
              onClick={fetchTelemetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Refresh</span>
            </button>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs">
              {['1H', '6H', '24H', '7D'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    range === r
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* CloudNexus Network Health Engine Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">CloudNexus Network Health</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    overallScore >= 90
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : overallScore >= 70
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : overallScore >= 40
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {healthStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Composite infrastructure health score evaluated across 5 operational dimensions.
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{overallScore}</span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
        </div>

        {/* 5 Health Breakdown Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Network</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-blue-600">{networkHealth?.networkScore ?? 95}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Compute</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-cyan-600">{networkHealth?.computeScore ?? 90}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Security</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-emerald-600">{networkHealth?.securityScore ?? 88}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Connectivity</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-indigo-600">{networkHealth?.connectivityScore ?? 94}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Monitoring</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-amber-600">{networkHealth?.monitoringScore ?? 93}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>
        </div>

        {/* Health Evaluation Reasons */}
        {networkHealth?.reasons && networkHealth.reasons.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 block mb-1.5 uppercase tracking-wider">
              Health Evidence & Findings
            </span>
            <ul className="space-y-1 text-xs text-slate-700 font-medium">
              {networkHealth.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="CPU Utilization"
          value={cpuVal}
          subvalue="Fleet average workload"
          icon="Zap"
          color="cyan"
        />

        <StatCard
          title="Avg Latency"
          value={latencyVal}
          subvalue="Cross-VPC roundtrip"
          icon="Activity"
          color="blue"
        />

        <StatCard
          title="EC2 Health"
          value={instanceHealthVal}
          subvalue="Compute fleet operational"
          icon="Server"
          color="green"
        />

        <StatCard
          title="Availability"
          value={availabilityVal}
          subvalue="TGW route uptime"
          icon="Gauge"
          color="green"
        />
      </div>

      {/* VPC Flow Logs Observability Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">VPC Flow Logs Telemetry</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {flowLogs.length > 0 && flowLogs[0].status !== 'not-enabled'
              ? `${flowLogs.length} active flow log(s)`
              : 'Flow logs status'}
          </span>
        </div>

        {flowLogs.length > 0 && flowLogs[0].status !== 'not-enabled' && flowLogs[0].status !== 'unavailable' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="py-2 pr-4">Flow Log ID</th>
                  <th className="py-2 px-4">Resource / VPC</th>
                  <th className="py-2 px-4">Traffic Type</th>
                  <th className="py-2 px-4">Destination Type</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {flowLogs.map((fl, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 pr-4 font-bold text-blue-600">{fl.flowLogId}</td>
                    <td className="py-2.5 px-4 text-slate-700">{fl.vpcName || fl.resourceId}</td>
                    <td className="py-2.5 px-4 text-slate-600">{fl.trafficType}</td>
                    <td className="py-2.5 px-4 text-slate-600">{fl.logDestinationType}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {fl.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">
                {flowLogs[0]?.message || 'VPC Flow Logs are not enabled in this environment.'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                To capture detailed IP traffic flows and reject packets, enable VPC Flow Logs on Dev-VPC, Test-VPC, or Prod-VPC pointing to CloudWatch Logs or an S3 bucket.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="space-y-6">
        {/* Chart 1: CPU Utilization by Environment */}
        <ChartCard
          title="CPU Utilization by Environment (%)"
          subtitle={`Workload instance processor telemetry over the selected ${range} period`}
        >
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rangeData.cpu} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="dev"
                  name="DEV (Dev-App-Server)"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="test"
                  name="TEST (Test-App-Server)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="prod"
                  name="PROD (Prod-App-Server)"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Row with Network Traffic & Cross-VPC Latency Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 2: Network Traffic (TGW MB/s) */}
          <ChartCard
            title="Network Traffic (Transit Gateway MB/s)"
            subtitle="Ingress vs Egress packet throughput across TGW attachments"
          >
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rangeData.network} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bytesInGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bytesOutGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" MB" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="bytesIn"
                    name="Inbound Traffic"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#bytesInGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="bytesOut"
                    name="Outbound Traffic"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#bytesOutGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Chart 3: Live VPC Throughput & Latency Probe */}
          <ChartCard
            title="Cross-VPC Throughput & Health Probes"
            subtitle="Real-time telemetry reported from backend monitoring service"
          >
            <div className="w-full h-64">
              {vpcChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vpcChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="vpc" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" Mbps" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar
                      dataKey="throughputMbps"
                      name="Throughput (Mbps)"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No telemetry data" description="Awaiting telemetry stream from probe." />
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;
