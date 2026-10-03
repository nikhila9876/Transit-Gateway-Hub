import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import { auditService } from '../services/auditService';
import { FileText, Clock, User, Shield, Filter } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
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

  const filteredLogs = logs.filter((log) => {
    const searchTarget = `${log.action} ${log.user || log.actor} ${log.resource} ${log.details || ''}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());

    const userVal = log.user || log.actor;
    const matchesUser = selectedUser === 'All' || userVal === selectedUser;
    const matchesAction = selectedAction === 'All' || log.action === selectedAction;
    const matchesStatus = selectedStatus === 'All' || log.status === selectedStatus;
    const matchesDate = selectedDate === 'All' || log.timestamp.startsWith(selectedDate);

    return matchesSearch && matchesUser && matchesAction && matchesStatus && matchesDate;
  });

  // Columns strictly matching p2.txt:
  // Timestamp, User, Action, Resource, Status
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
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <span className="font-mono text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1.5 w-fit font-medium">
          <User className="w-3 h-3 text-blue-500" />
          <span>{row.user || row.actor}</span>
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <span className="font-semibold text-xs text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Resource',
      accessor: 'resource',
      render: (row) => (
        <span className="font-mono text-xs text-slate-700 font-medium">
          {row.resource}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <StatusBadge
          status={row.status === 'SUCCESS' ? 'healthy' : row.status === 'WARNING' ? 'warning' : 'critical'}
          text={row.status}
        />
      ),
    },
  ];

  if (loading) return <LoadingState message="Retrieving compliance audit trail..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable compliance trail documenting configuration changes, routing events, and administrative sessions."
        breadcrumbs={[{ label: 'Administration' }, { label: 'Audit Logs' }]}
      />

      {/* Filter and Search Bar (p2.txt: Filters: Date, User, Action, Status + Search) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="w-full lg:max-w-sm">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by action, user, or resource..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Date Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Date:</span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="All">All Dates</option>
                <option value="2026-10-04">Today (2026-10-04)</option>
                <option value="2026-10-03">Yesterday (2026-10-03)</option>
              </select>
            </div>

            {/* User Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">User:</span>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="All">All Users</option>
                <option value="admin@cloudnexus.io">admin@cloudnexus.io</option>
                <option value="engineer@cloudnexus.io">engineer@cloudnexus.io</option>
                <option value="viewer@cloudnexus.io">viewer@cloudnexus.io</option>
                <option value="security-scanner">security-scanner</option>
                <option value="session-manager">session-manager</option>
              </select>
            </div>

            {/* Action Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Action:</span>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="All">All Actions</option>
                <option value="Login">Login</option>
                <option value="Dashboard Viewed">Dashboard Viewed</option>
                <option value="VPC Viewed">VPC Viewed</option>
                <option value="Network Test">Network Test</option>
                <option value="AI Analysis">AI Analysis</option>
                <option value="AWS Synchronization">AWS Synchronization</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="All">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="WARNING">WARNING</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-800">Compliance Event Records</span>
          <span>Showing {filteredLogs.length} matching events</span>
        </div>
        <DataTable columns={columns} data={filteredLogs} />
      </div>
    </div>
  );
};

export default AuditLogsPage;
