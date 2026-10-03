import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import SectionHeader from '../components/common/SectionHeader';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import { MOCK_SECURITY } from '../data/mockSecurity';
import {
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Info,
  Lock,
  Layers,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

export const SecurityPage = () => {
  const [securityData, setSecurityData] = useState(MOCK_SECURITY);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const findings = Array.isArray(securityData?.findings) ? securityData.findings : [];

  const filteredFindings = findings.filter((f) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Critical') return f.severity === 'critical';
    if (selectedFilter === 'Warnings') return f.severity === 'warning';
    if (selectedFilter === 'Informational') return f.severity === 'informational' || f.severity === 'info';
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Center"
        subtitle="Continuous security posture assessment, security group rules, and cross-VPC isolation policies."
        breadcrumbs={[{ label: 'Security' }, { label: 'Security Center' }]}
      />

      {/* Top Section: Security Score & Breakdown Cards (p2.txt: Security Score 86/100, Critical Findings, Warnings, Informational) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Top Card: Security Score 86/100 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Security Score</span>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              86 <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Review Recommended</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Critical Findings */}
        <StatCard
          title="Critical Findings"
          value="1"
          subvalue="Isolation rule active"
          icon="AlertCircle"
          color="red"
        />

        {/* Warnings */}
        <StatCard
          title="Warnings"
          value="2"
          subvalue="Broad ingress & exposure"
          icon="AlertTriangle"
          color="amber"
        />

        {/* Informational */}
        <StatCard
          title="Informational"
          value="3"
          subvalue="Hygiene recommendations"
          icon="Info"
          color="cyan"
        />
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Critical', 'Warnings', 'Informational'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredFindings.length} findings
        </div>
      </div>

      {/* Finding Cards Grid (p2.txt: Severity, Title, Resource, Description, Evidence, Recommendation) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFindings.map((finding) => {
          const isCritical = finding.severity === 'critical';
          const isWarning = finding.severity === 'warning';

          const cardBorder = isCritical
            ? 'border-rose-200 bg-rose-50/20'
            : isWarning
            ? 'border-amber-200 bg-amber-50/20'
            : 'border-slate-200 bg-white';

          const badgeColor = isCritical
            ? 'bg-rose-100 text-rose-800 border-rose-300'
            : isWarning
            ? 'bg-amber-100 text-amber-800 border-amber-300'
            : 'bg-blue-50 text-blue-700 border-blue-200';

          return (
            <div
              key={finding.id}
              className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${cardBorder}`}
            >
              <div>
                {/* Header: Severity Badge & Title */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wider ${badgeColor}`}
                    >
                      {finding.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{finding.id}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{finding.category}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">{finding.title}</h4>

                {/* Resource */}
                <div className="mt-2 text-xs flex items-center gap-2 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-medium text-[11px]">Resource:</span>
                  <span className="font-mono font-bold text-slate-800">{finding.resourceName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({finding.resourceId})</span>
                </div>

                {/* Description */}
                <div className="mt-3 text-xs text-slate-600 leading-relaxed">
                  <p className="font-medium text-slate-700">{finding.description}</p>
                </div>

                {/* Evidence */}
                {finding.evidence && (
                  <div className="mt-2 text-xs bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/60 font-mono text-[11px] text-slate-700">
                    <span className="font-bold font-sans block text-slate-500 text-[10px] uppercase mb-0.5">Evidence:</span>
                    {finding.evidence}
                  </div>
                )}
              </div>

              {/* Recommendation */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Recommendation:</span>
                <p className="text-blue-700 bg-blue-50/80 p-2 rounded-xl border border-blue-100 text-xs font-medium">
                  {finding.recommendation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecurityPage;
