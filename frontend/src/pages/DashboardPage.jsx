import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import AlertCard from '../components/common/AlertCard';
import SectionHeader from '../components/common/SectionHeader';
import EnvironmentOverviewCard from '../components/dashboard/EnvironmentOverviewCard';
import TgwStatusCard from '../components/dashboard/TgwStatusCard';
import NetworkHealthChart from '../components/dashboard/NetworkHealthChart';
import RecentActivityTimeline from '../components/dashboard/RecentActivityTimeline';
import SecurityOverviewCard from '../components/dashboard/SecurityOverviewCard';
import AiInsightCard from '../components/dashboard/AiInsightCard';
import VpcDetailModal from '../components/network/VpcDetailModal';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { dashboardService } from '../services/dashboardService';
import { vpcService } from '../services/vpcService';
import { transitGatewayService } from '../services/transitGatewayService';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [vpcs, setVpcs] = useState([]);
  const [tgw, setTgw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVpc, setSelectedVpc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSync, setLastSync] = useState('Just now');

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumData, vpcData, tgwData] = await Promise.all([
        dashboardService.getSummary(),
        vpcService.getVpcs(),
        transitGatewayService.getTransitGateway(),
      ]);
      setSummary(sumData);
      setVpcs(vpcData);
      setTgw(tgwData);
      setLastSync('Just now');
    } catch (err) {
      setError(err.message || 'Error loading dashboard telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleViewVpcDetails = (vpc) => {
    setSelectedVpc(vpc);
    setIsModalOpen(true);
  };

  if (loading) return <LoadingState message="Connecting to CloudNexus network intelligence..." />;
  if (error) return <ErrorState message={error} onRetry={loadDashboard} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Network Overview"
        subtitle="Monitor your AWS multi-VPC infrastructure from a single control plane."
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Last synchronized: <strong className="text-slate-800">{lastSync}</strong>
            </span>
            <button
              onClick={loadDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Refresh</span>
            </button>
          </div>
        }
      />

      {/* Top 6 Stat Cards (Explicitly specified in p2.txt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* CARD 1: Total VPCs */}
        <StatCard
          title="Total VPCs"
          value="3"
          subvalue="3 connected environments"
          icon="Layers"
          color="blue"
        />

        {/* CARD 2: Transit Gateway */}
        <StatCard
          title="Transit Gateway"
          value="Available"
          subvalue="Enterprise-TGW"
          icon="Share2"
          color="green"
        />

        {/* CARD 3: TGW Attachments */}
        <StatCard
          title="TGW Attachments"
          value="3"
          subvalue="All attachments active"
          icon="Network"
          color="indigo"
        />

        {/* CARD 4: EC2 Instances */}
        <StatCard
          title="EC2 Instances"
          value="3"
          subvalue="2 healthy • 1 attention"
          icon="Server"
          color="cyan"
        />

        {/* CARD 5: Network Health */}
        <StatCard
          title="Network Health"
          value="94%"
          subvalue="+3.2% from previous check"
          icon="Activity"
          color="green"
          trend="+3.2%"
          trendDirection="up"
        />

        {/* CARD 6: Security Findings */}
        <StatCard
          title="Security Findings"
          value="4"
          subvalue="1 critical • 2 warnings"
          icon="ShieldCheck"
          color="amber"
        />
      </div>

      {/* Priority Alert Banner */}
      <AlertCard
        severity="info"
        title="Enterprise Transit Hub Active (us-east-1)"
        description="Enterprise-TGW is actively routing between DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16). Prod-App-SG strictly enforces DEV direct ingress isolation."
        action="Run Diagnostics"
        onAction={() => (window.location.href = '/connectivity')}
      />

      {/* VPC Environment Overview Section */}
      <div className="space-y-4">
        <SectionHeader
          title="Environment Overview"
          description="Dedicated VPC environments connected via dedicated Transit Gateway attachments."
          action={
            <Link
              to="/vpcs"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>View all VPCs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {vpcs.map((vpc) => (
            <EnvironmentOverviewCard
              key={vpc.id}
              vpc={vpc}
              onViewDetails={handleViewVpcDetails}
            />
          ))}
        </div>
      </div>

      {/* Middle Row: Network Health Chart & Transit Gateway Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NetworkHealthChart />
        </div>
        <div>
          <TgwStatusCard tgw={tgw} />
        </div>
      </div>

      {/* Bottom Row: Recent Activity, Security Overview & AI Insight Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentActivityTimeline />
        <SecurityOverviewCard />
        <AiInsightCard />
      </div>

      {/* VPC Detail Modal */}
      <VpcDetailModal
        vpc={selectedVpc}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
