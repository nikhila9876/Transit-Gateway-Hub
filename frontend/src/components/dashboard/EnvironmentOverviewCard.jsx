import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Layers, Server, ArrowRight } from 'lucide-react';

export const EnvironmentOverviewCard = ({ vpc, onViewDetails }) => {
  const isWarning = vpc.status === 'Warning' || vpc.name === 'PROD';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
              style={{ backgroundColor: vpc.color || '#3b82f6' }}
            >
              {vpc.name}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{vpc.displayName || vpc.name}</h4>
              <span className="text-xs font-mono text-slate-500">{vpc.cidr}</span>
            </div>
          </div>
          <StatusBadge
            status={isWarning ? 'warning' : 'healthy'}
            text={isWarning ? 'Warning' : 'Healthy'}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{vpc.subnetCount} Subnets</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span>{vpc.ec2Count} EC2 Instance</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs py-1.5 px-2 bg-slate-50 rounded-lg">
          <span className="text-slate-500">TGW Attachment:</span>
          <span className="font-semibold text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {vpc.attachmentStatus || 'Attached'}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => onViewDetails && onViewDetails(vpc)}
          className="w-full text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between group py-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default EnvironmentOverviewCard;
