import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TgwStatusCard = ({ tgw }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{tgw?.name || 'Enterprise-TGW'}</h3>
              <span className="text-xs font-mono text-slate-500">{tgw?.id || 'tgw-09e8712a34bc56df0'}</span>
            </div>
          </div>
          <StatusBadge status="available" text="Available" />
        </div>

        {/* TGW Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 mb-4">
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-slate-500 block text-[10px]">Region</span>
            <span className="font-semibold text-slate-800 font-mono">{tgw?.region || 'us-east-1'}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-slate-500 block text-[10px]">Connected VPCs</span>
            <span className="font-semibold text-blue-600">3 Connected</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-slate-500 block text-[10px]">Attachments</span>
            <span className="font-semibold text-indigo-600">3 Active</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-slate-500 block text-[10px]">Routes</span>
            <span className="font-semibold text-slate-800">Multiple (Propagated)</span>
          </div>
        </div>

        {/* Small Visual Hub-and-Spoke Representation */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 my-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Hub-and-Spoke Topology
          </div>

          <div className="flex flex-col items-center">
            {/* Top Node: DEV */}
            <div className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-lg text-xs font-bold text-blue-800 shadow-2xs">
              DEV (10.10.0.0/16)
            </div>

            {/* Vertical connector line */}
            <div className="w-0.5 h-4 bg-blue-400 my-0.5" />

            {/* Central Node: Enterprise-TGW */}
            <div className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>Enterprise-TGW</span>
            </div>

            {/* Branching SVG connector lines */}
            <svg className="w-40 h-6" viewBox="0 0 160 24">
              <path
                d="M 80 0 L 80 8 L 30 24"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
              />
              <path
                d="M 80 0 L 80 8 L 130 24"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
              />
            </svg>

            {/* Bottom Spoke Nodes: TEST & PROD */}
            <div className="flex items-center justify-between w-full px-2 text-xs">
              <div className="px-2.5 py-1 bg-cyan-100 border border-cyan-300 rounded-lg font-bold text-cyan-800 shadow-2xs text-[11px]">
                TEST (10.20.0.0/16)
              </div>
              <div className="px-2.5 py-1 bg-indigo-100 border border-indigo-300 rounded-lg font-bold text-indigo-800 shadow-2xs text-[11px]">
                PROD (10.30.0.0/16)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <Link
          to="/transit-gateway"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between group"
        >
          <span>View Transit Gateway</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default TgwStatusCard;
