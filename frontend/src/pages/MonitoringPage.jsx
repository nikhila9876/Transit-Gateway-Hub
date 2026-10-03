import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
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
import { Cpu, Network, CheckCircle2, Activity } from 'lucide-react';

export const MonitoringPage = () => {
  const [range, setRange] = useState('6H');

  const rangeData = MOCK_MONITORING.ranges[range] || MOCK_MONITORING.ranges['6H'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network & Infrastructure Monitoring"
        subtitle="Real-time CPU, network telemetry, and EC2 instance health metrics across AWS Transit Gateway attachments."
        breadcrumbs={[{ label: 'Operations' }, { label: 'Monitoring' }]}
        actions={
          /* Time Range Controls (p2.txt: 1H, 6H, 24H, 7D) */
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
        }
      />

      {/* Top 4 KPI Cards (p2.txt: CPU, Network, EC2 Health, Availability) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Card */}
        <StatCard
          title="CPU"
          value="14.2%"
          subvalue="Nominal load across fleet"
          icon="Zap"
          color="cyan"
        />

        {/* Network Card */}
        <StatCard
          title="Network"
          value="7.3 MB/s"
          subvalue="Aggregated TGW Throughput"
          icon="Activity"
          color="blue"
        />

        {/* EC2 Health Card */}
        <StatCard
          title="EC2 Health"
          value="100%"
          subvalue="3/3 instances healthy"
          icon="Server"
          color="green"
        />

        {/* Availability Card */}
        <StatCard
          title="Availability"
          value="99.98%"
          subvalue="Sub-second TGW failover"
          icon="Gauge"
          color="green"
        />
      </div>

      {/* Charts Grid (p2.txt: CPU Utilization, Network Traffic, Instance Health) */}
      <div className="space-y-6">
        {/* Chart 1: CPU Utilization */}
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

        {/* Row with Network Traffic & Instance Health Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 2: Network Traffic */}
          <ChartCard
            title="Network Traffic (Transit Gateway MB/s)"
            subtitle="Ingress vs Egress packet throughput across TGW ENI attachments"
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

          {/* Chart 3: Instance Health */}
          <ChartCard
            title="Instance Health Telemetry"
            subtitle="System status checks and reachability probes over time"
          >
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rangeData.instanceHealth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 4]} allowDecimals={false} />
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
                  <Bar
                    dataKey="healthy"
                    name="Healthy Nodes (2/2 checks pass)"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;
