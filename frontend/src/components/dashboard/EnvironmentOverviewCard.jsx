import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Layers, Server, ShieldCheck } from 'lucide-react';

export const EnvironmentOverviewCard = ({ vpc }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-200 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm"
            style={{ backgroundColor: vpc.color || '#3b82f6' }}
          >
            {vpc.name}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{vpc.displayName || vpc.name}</h4>
            <span className="text-xs font-mono text-slate-500">{vpc.cidr}</span>
          </div>
        </div>
        <StatusBadge status={vpc.state} />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>{vpc.subnetCount} Subnets</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>{vpc.ec2Count} Instance</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>{vpc.securityGroup}</span>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentOverviewCard;
