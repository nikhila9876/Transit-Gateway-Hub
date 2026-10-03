import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AWS_REGION } from '../../utils/constants';
import GlobalSearch from './GlobalSearch';

const PAGE_METADATA = {
  '/dashboard': { title: 'Dashboard', section: 'Overview' },
  '/network-topology': { title: 'Network Topology', section: 'Network' },
  '/vpcs': { title: 'VPC Explorer', section: 'Network' },
  '/transit-gateway': { title: 'Transit Gateway', section: 'Network' },
  '/route-tables': { title: 'Route Tables', section: 'Network' },
  '/ec2': { title: 'EC2 Instances', section: 'Compute' },
  '/connectivity': { title: 'Connectivity Tester', section: 'Operations' },
  '/monitoring': { title: 'Monitoring', section: 'Operations' },
  '/security': { title: 'Security Center', section: 'Security' },
  '/ai-assistant': { title: 'AI Assistant', section: 'Intelligence' },
  '/audit-logs': { title: 'Audit Logs', section: 'Administration' },
};

export const TopNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const currentMeta = PAGE_METADATA[location.pathname] || { title: 'CloudNexus Hub', section: 'Console' };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Breadcrumb Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <span>CloudNexus</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold">{currentMeta.section}</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold truncate">{currentMeta.title}</span>
          </div>
          <h1 className="text-sm font-bold text-slate-900 truncate hidden sm:block">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-sm hidden md:block">
        <GlobalSearch />
      </div>

      {/* Right: Region, System Status, Notifications, User Role */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* AWS Region */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
          <span className="text-slate-400 font-sans text-[11px]">Region:</span>
          <span className="font-semibold text-slate-800">{AWS_REGION}</span>
        </div>

        {/* Operational Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All Systems Operational</span>
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-800">
                <span>Recent System Alerts</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Real-time</span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="font-semibold text-slate-800">TGW Route Propagation Active</div>
                  <p className="text-[11px] text-slate-500">All 3 VPC CIDRs verified on Enterprise-TGW.</p>
                  <span className="text-[10px] text-slate-400">2 min ago</span>
                </div>
                <div className="p-2 bg-amber-50/60 border border-amber-100 rounded-lg">
                  <div className="font-semibold text-amber-800">Security Audit Notice</div>
                  <p className="text-[11px] text-amber-700">Dev-App-SG broad ingress rule flagged for review.</p>
                  <span className="text-[10px] text-amber-500">15 min ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Role */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-none">
              {user?.username || 'admin'}
            </div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">
              Role: {user?.role === 'ROLE_VIEWER' ? 'VIEWER' : 'ADMIN'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
