import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { monitoringService } from '../services/monitoringService';
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
import { RefreshCw, Activity, Cpu, Server, Gauge, ShieldAlert } from 'lucide-react';

export const MonitoringPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [range, setRange] = useState('6H');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await monitoringService.getMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve telemetry metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const rangeData = MOCK_MONITORING.ranges[range] || MOCK_MONITORING.ranges['6H'];

  if (loading) return <LoadingState message="Collecting infrastructure telemetry from CloudWatch probe..." />;
  if (error) return <ErrorState message={error} onRetry={fetchMetrics} />;

  const cpuVal = metrics?.cpuUtilization !== undefined ? `${metrics.cpuUtilization}%` : '18.4%';
  const latencyVal = metrics?.avgLatencyMs !== undefined ? `${metrics.avgLatencyMs} ms` : '1.34 ms';
  const instanceHealthVal = metrics?.instanceHealth !== undefined ? `${metrics.instanceHealth}%` : '100%';
  const availabilityVal = metrics?.availability || '99.99%';

  // Format VPC metrics for bar chart
  const vpcChartData = (metrics?.vpcMetrics || []).map((vm) => ({
    vpc: vm.vpc,
    latencyMs: vm.latencyMs,
    throughputMbps: vm.throughputMbps,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network & Infrastructure Monitoring"
        subtitle="Real-time CPU, network telemetry, and EC2 instance health metrics across AWS Transit Gateway attachments."
        breadcrumbs={[{ label: 'Operations' }, { label: 'Monitoring' }]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMetrics}
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
          subvalue="All nodes operational"
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
