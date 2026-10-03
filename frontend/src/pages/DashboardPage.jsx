import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import AlertCard from '../components/common/AlertCard';
import SectionHeader from '../components/common/SectionHeader';
import EnvironmentOverviewCard from '../components/dashboard/EnvironmentOverviewCard';
import TrafficChart from '../components/dashboard/TrafficChart';
import TgwStatusCard from '../components/dashboard/TgwStatusCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { dashboardService } from '../services/dashboardService';
import { vpcService } from '../services/vpcService';
import { transitGatewayService } from '../services/transitGatewayService';
import { monitoringService } from '../services/monitoringService';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [vpcs, setVpcs] = useState([]);
  const [tgw, setTgw] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumData, vpcData, tgwData, metricData] = await Promise.all([
        dashboardService.getSummary(),
        vpcService.getVpcs(),
        transitGatewayService.getTransitGateway(),
        monitoringService.getMetrics(),
      ]);
      setSummary(sumData);
      setVpcs(vpcData);
      setTgw(tgwData);
      setMetrics(metricData);
    } catch (err) {
      setError(err.message || 'Error loading dashboard telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <LoadingState message="Connecting to CloudNexus network intelligence..." />;
  if (error) return <ErrorState message={error} onRetry={loadDashboard} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Enterprise Multi-VPC Network Hub"
        subtitle="Centralized management and observability across AWS Transit Gateway connected environments."
        actions={
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        }
      />

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total VPCs"
          value={summary?.totalVpcs || 3}
          subvalue="DEV, TEST, PROD"
          icon="Layers"
          color="blue"
        />
        <StatCard
          title="Transit Gateway"
          value={summary?.transitGatewayStatus || 'Available'}
          subvalue={summary?.transitGatewayName || 'Enterprise-TGW'}
          icon="Share2"
          color="indigo"
        />
        <StatCard
          title="TGW Attachments"
          value={summary?.tgwAttachments || 3}
          subvalue="3 VPC Attachments"
          icon="Network"
          color="cyan"
        />
        <StatCard
          title="EC2 Instances"
          value={summary?.ec2Instances || 3}
          subvalue="Workload nodes running"
          icon="Server"
          color="green"
        />
        <StatCard
          title="Network Health"
          value={`${summary?.networkHealth || 94}%`}
          subvalue="Zero packet loss"
          icon="Activity"
          color="green"
          trend="+2.1%"
          trendDirection="up"
        />
        <StatCard
          title="Security Findings"
          value={summary?.securityFindings || 4}
          subvalue="1 Policy Enforced"
          icon="ShieldCheck"
          color="amber"
        />
      </div>

      {/* Priority Alert Banner */}
      <AlertCard
        severity="info"
        title="Cross-VPC Transit Hub Active"
        description="Enterprise-TGW in us-east-1 is actively routing private traffic between DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16). Prod-App-SG policy isolates DEV direct ingress."
        action="Run Diagnostics"
        onAction={() => (window.location.href = '/connectivity')}
      />

      {/* Main Grid: VPC Breakdown & Transit Gateway Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader
            title="Monitored VPC Environments"
            description="Dedicated VPC environments connected via dedicated Transit Gateway attachments."
            action={
              <Link to="/vpcs" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <span>View all VPCs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vpcs.map((vpc) => (
              <EnvironmentOverviewCard key={vpc.id} vpc={vpc} />
            ))}
          </div>

          {/* Traffic Throughput Chart */}
          <div className="pt-2">
            <ChartCard
              title="Cross-VPC Transit Gateway Throughput"
              subtitle="Aggregated ingress and egress packet volume across all 3 attachments (MB/s)"
            >
              <TrafficChart data={metrics?.throughput || []} />
            </ChartCard>
          </div>
        </div>

        {/* Right Column: TGW Status & Quick Links */}
        <div className="space-y-6">
          <TgwStatusCard tgw={tgw} />

          {/* Architecture Insights Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Architecture Highlights</h4>
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span>Centralized Hub-and-Spoke avoiding mesh peering overhead.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>Private application connectivity over HTTP port 8080.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span>DEV to PROD access strictly blocked by SG isolation policies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                <span>Systems Manager Session Manager enabled for secure administration.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
