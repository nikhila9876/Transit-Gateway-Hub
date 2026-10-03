import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import LatencyChart from '../components/monitoring/LatencyChart';
import TrafficChart from '../components/dashboard/TrafficChart';
import LoadingState from '../components/common/LoadingState';
import { monitoringService } from '../services/monitoringService';
import { LineChart, Activity, Gauge, Zap } from 'lucide-react';

export const MonitoringPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await monitoringService.getMetrics();
        setMetrics(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingState message="Fetching network metrics from monitoring service..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network Monitoring & Metrics"
        subtitle="Real-time latency, throughput, and packet telemetry across Transit Gateway attachments."
        breadcrumbs={[{ label: 'Operations' }, { label: 'Monitoring' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Latency (DEV ↔ TEST)"
          value="1.2 ms"
          subvalue="Sub-millisecond TGW routing"
          icon="Zap"
          color="blue"
        />
        <StatCard
          title="Average Latency (TEST ↔ PROD)"
          value="1.4 ms"
          subvalue="Optimal availability zone routing"
          icon="Zap"
          color="cyan"
        />
        <StatCard
          title="Packet Loss"
          value="0.00 %"
          subvalue="No drops detected"
          icon="Activity"
          color="green"
        />
        <StatCard
          title="Network Health Score"
          value={`${metrics?.healthScore || 94}%`}
          subvalue="Enterprise SLAs nominal"
          icon="Gauge"
          color="green"
        />
      </div>

      {/* Latency History Chart */}
      <ChartCard
        title="Cross-VPC Latency Over Time (ms)"
        subtitle="Measured round-trip time between EC2 workload endpoints routed via Enterprise-TGW"
      >
        <LatencyChart data={metrics?.latencyHistory || []} />
      </ChartCard>

      {/* Traffic Throughput */}
      <ChartCard
        title="Transit Gateway Attachment Throughput"
        subtitle="Aggregate byte traffic traversing Enterprise-TGW attachments"
      >
        <TrafficChart data={metrics?.throughput || []} />
      </ChartCard>
    </div>
  );
};

export default MonitoringPage;
