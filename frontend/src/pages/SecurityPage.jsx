import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { securityService } from '../services/securityService';
import {
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  FlaskConical,
} from 'lucide-react';

export const SecurityPage = () => {
  const [findings, setFindings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFindings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await securityService.getFindings();
      setFindings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load security findings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFindings();
  }, []);

  const safeFindings = Array.isArray(findings) ? findings : [];

  const filteredFindings = safeFindings.filter((f) => {
    const sev = (f.severity || '').toLowerCase();
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Critical') return sev === 'critical' || sev === 'high';
    if (selectedFilter === 'Warnings') return sev === 'warning' || sev === 'medium';
    if (selectedFilter === 'Informational') return sev === 'informational' || sev === 'info' || sev === 'low';
    if (selectedFilter === 'Resolved') return sev === 'resolved' || (f.status || '').toLowerCase() === 'healthy';
    return true;
  });

  const criticalCount = safeFindings.filter((f) => ['critical', 'high'].includes((f.severity || '').toLowerCase())).length;
  const warningCount = safeFindings.filter((f) => ['warning', 'medium'].includes((f.severity || '').toLowerCase())).length;
  const infoCount = safeFindings.filter((f) => ['informational', 'info', 'low'].includes((f.severity || '').toLowerCase())).length;
  const resolvedCount = safeFindings.filter((f) => ['resolved', 'healthy'].includes((f.severity || '').toLowerCase()) || (f.status || '').toLowerCase() === 'healthy').length;

  if (loading) return <LoadingState message="Scanning security findings from backend API..." />;
  if (error) return <ErrorState message={error} onRetry={fetchFindings} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Center"
        subtitle="Security posture assessment, security group policies, and cross-VPC isolation rules."
        breadcrumbs={[{ label: 'Security' }, { label: 'Security Center' }]}
        actions={
          <button
            onClick={fetchFindings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Refresh Scan</span>
          </button>
        }
      />

      {/* Notice regarding Dev/Mock Environment */}
      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          <strong>Development Mode:</strong> Security findings below reflect backend architectural policy rules and simulated audit metrics.
        </span>
      </div>

      {/* Top Section: Score & Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <StatCard
          title="Critical Findings"
          value={criticalCount}
          subvalue="Isolation rule active"
          icon="AlertCircle"
          color="red"
        />

        <StatCard
          title="Warnings"
          value={warningCount}
          subvalue="Broad ingress & exposure"
          icon="AlertTriangle"
          color="amber"
        />

        <StatCard
          title="Informational"
          value={infoCount}
          subvalue="Hygiene recommendations"
          icon="Info"
          color="cyan"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Critical', 'Warnings', 'Informational', 'Resolved'].map((filter) => (
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
          Showing {filteredFindings.length} of {safeFindings.length} findings
        </div>
      </div>

      {/* Findings Grid */}
      {filteredFindings.length === 0 ? (
        <EmptyState
          title="No security findings"
          description={`No security findings match the "${selectedFilter}" filter criteria.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFindings.map((finding) => {
            const sev = (finding.severity || '').toLowerCase();
            const isCritical = sev === 'critical' || sev === 'high';
            const isWarning = sev === 'warning' || sev === 'medium';
            const isResolved = sev === 'resolved' || (finding.status || '').toLowerCase() === 'healthy';

            const cardBorder = isCritical
              ? 'border-rose-200 bg-rose-50/20'
              : isWarning
              ? 'border-amber-200 bg-amber-50/20'
              : isResolved
              ? 'border-emerald-200 bg-emerald-50/20'
              : 'border-slate-200 bg-white';

            const badgeColor = isCritical
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : isWarning
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : isResolved
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-blue-50 text-blue-700 border-blue-200';

            return (
              <div
                key={finding.id}
                className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${cardBorder}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wider ${badgeColor}`}
                      >
                        {finding.severity || 'Info'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{finding.id}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{finding.category || 'Architecture'}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">{finding.title}</h4>

                  {/* Resource */}
                  <div className="mt-2 text-xs flex items-center gap-2 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium text-[11px]">Resource:</span>
                    <span className="font-mono font-bold text-slate-800">{finding.resourceName || finding.resource}</span>
                    {finding.resourceId && (
                      <span className="text-[10px] text-slate-400 font-mono">({finding.resourceId})</span>
                    )}
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
                {finding.recommendation && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Recommendation:</span>
                    <p className="text-blue-700 bg-blue-50/80 p-2 rounded-xl border border-blue-100 text-xs font-medium">
                      {finding.recommendation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SecurityPage;
