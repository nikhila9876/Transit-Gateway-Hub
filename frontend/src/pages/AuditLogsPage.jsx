import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import { auditService } from '../services/auditService';
import { FileText, Clock, User, Shield } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await auditService.getAuditLogs();
        setLogs(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      render: (row) => (
        <span className="font-mono text-xs text-slate-500 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.timestamp}</span>
        </span>
      ),
    },
    {
      header: 'Actor / Identity',
      accessor: 'actor',
      render: (row) => (
        <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
          <User className="w-3 h-3 text-blue-500" />
          <span>{row.actor}</span>
        </span>
      ),
    },
    {
      header: 'Action Executed',
      accessor: 'action',
      render: (row) => <span className="font-semibold text-xs text-slate-800">{row.action}</span>,
    },
    {
      header: 'Target Resource',
      accessor: 'resource',
      render: (row) => <span className="font-mono text-xs text-slate-700">{row.resource}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status === 'SUCCESS' ? 'healthy' : 'critical'} text={row.status} />,
    },
    {
      header: 'Event Details',
      accessor: 'details',
      render: (row) => <span className="text-xs text-slate-600 leading-normal">{row.details}</span>,
    },
  ];

  if (loading) return <LoadingState message="Retrieving compliance audit trail..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration Audit Logs"
        subtitle="Immutable compliance trail documenting configuration changes, routing events, and administrative sessions."
        breadcrumbs={[{ label: 'Administration' }, { label: 'Audit Logs' }]}
      />

      <div className="flex items-center justify-between">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Filter audit entries by actor, action, or resource..."
        />
        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredLogs.length} audit records
        </span>
      </div>

      <DataTable columns={columns} data={filteredLogs} />
    </div>
  );
};

export default AuditLogsPage;
