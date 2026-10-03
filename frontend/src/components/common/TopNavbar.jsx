import React from 'react';
import { Menu, Globe, Bell, Shield, Server, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AWS_REGION, TRANSIT_GATEWAY_NAME } from '../../utils/constants';
import StatusBadge from './StatusBadge';

export const TopNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Environment Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">AWS Learner Lab</span>
          <span className="text-slate-400">|</span>
          <span className="font-mono text-slate-500">{AWS_REGION}</span>
        </div>

        {/* TGW Status Pill */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-slate-400">Hub:</span>
          <span className="font-semibold text-slate-800">{TRANSIT_GATEWAY_NAME}</span>
          <StatusBadge status="available" text="Available" size="xs" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Insights indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Intelligence Ready</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
        </div>

        {/* Security Indicator */}
        <div className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Shield className="w-3.5 h-3.5" />
          <span className="font-medium">Protected (JWT)</span>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
