import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import SectionHeader from '../components/common/SectionHeader';
import SecurityFindingsTable from '../components/security/SecurityFindingsTable';
import LoadingState from '../components/common/LoadingState';
import { securityService } from '../services/securityService';
import { ShieldCheck, Lock, AlertTriangle, FileCode } from 'lucide-react';

export const SecurityPage = () => {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await securityService.getFindings();
        setFindings(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingState message="Running security baseline audit..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network Security Center"
        subtitle="Continuous security posture assessment, security group rules, and cross-VPC isolation policies."
        breadcrumbs={[{ label: 'Security' }, { label: 'Security Center' }]}
      />

      {/* Security KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Posture Score"
          value="94 / 100"
          subvalue="Enterprise High Compliance"
          icon="ShieldCheck"
          color="green"
        />
        <StatCard
          title="Active Policies"
          value="3 VPC SGs"
          subvalue="Dev, Test, Prod isolated"
          icon="Lock"
          color="blue"
        />
        <StatCard
          title="Blocked Ingress Paths"
          value="1 Restricted"
          subvalue="DEV → PROD blocked"
          icon="AlertTriangle"
          color="purple"
        />
        <StatCard
          title="Public SSH Ports"
          value="0 Open"
          subvalue="Port 22 closed; SSM used"
          icon="ShieldCheck"
          color="green"
        />
      </div>

      {/* Findings Table */}
      <div className="space-y-3">
        <SectionHeader
          title="Security Policies & Recommendations"
          description="Audited network security findings across Transit Gateway, VPC security groups, and workload instances."
        />
        <SecurityFindingsTable findings={findings} />
      </div>
    </div>
  );
};

export default SecurityPage;
