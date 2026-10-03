import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Share2, Layers, Server } from 'lucide-react';

const ICON_MAP = {
  Share2,
  Layers,
  Server,
};

export const NetworkNode = ({ data }) => {
  const IconComponent = ICON_MAP[data.icon] || Server;

  const bgClasses = {
    tgw: 'border-blue-500 bg-blue-50/90 text-blue-900',
    vpc_dev: 'border-blue-400 bg-white text-slate-800',
    vpc_test: 'border-cyan-400 bg-white text-slate-800',
    vpc_prod: 'border-indigo-400 bg-white text-slate-800',
    ec2: 'border-emerald-400 bg-white text-slate-800',
  };

  const currentStyle = bgClasses[data.type] || 'border-slate-300 bg-white text-slate-800';

  return (
    <div className={`px-4 py-3 shadow-md rounded-xl border-2 min-w-[160px] ${currentStyle}`}>
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-blue-600" />
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-blue-600" />
      
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
          <IconComponent className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold">{data.label}</div>
          {data.subtext && <div className="text-[10px] text-slate-500 font-mono">{data.subtext}</div>}
        </div>
      </div>

      {data.status && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span className="text-slate-500">Status</span>
          <span className="font-semibold text-emerald-600">{data.status}</span>
        </div>
      )}
    </div>
  );
};

export default NetworkNode;
