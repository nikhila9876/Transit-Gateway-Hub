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

  // Custom styling per node type based on p2.txt
  // DEV: blue, TEST: indigo, PROD: purple/blue, TGW: strong blue/indigo
  const typeStyles = {
    tgw: {
      border: 'border-blue-600',
      bg: 'bg-gradient-to-b from-blue-50 to-indigo-50/80',
      title: 'text-blue-950 font-bold',
      badge: 'bg-blue-600 text-white',
    },
    vpc_dev: {
      border: 'border-blue-400',
      bg: 'bg-white',
      title: 'text-blue-900 font-bold',
      badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    vpc_test: {
      border: 'border-indigo-400',
      bg: 'bg-white',
      title: 'text-indigo-900 font-bold',
      badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    },
    vpc_prod: {
      border: 'border-purple-400',
      bg: 'bg-white',
      title: 'text-purple-900 font-bold',
      badge: 'bg-purple-50 text-purple-700 border border-purple-200',
    },
    ec2: {
      border: 'border-emerald-400',
      bg: 'bg-white',
      title: 'text-slate-900 font-semibold',
      badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
  };

  const style = typeStyles[data.type] || {
    border: 'border-slate-300',
    bg: 'bg-white',
    title: 'text-slate-800 font-semibold',
    badge: 'bg-slate-100 text-slate-700',
  };

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-2xl border-2 min-w-[190px] transition-all hover:shadow-lg ${style.border} ${style.bg}`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-blue-600" />
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-blue-600" />

      {/* Header: Icon & Name */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-slate-100/80 text-slate-700 flex-shrink-0">
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className={`text-xs truncate ${style.title}`}>{data.label}</div>
          {data.cidr && <div className="text-[10px] text-slate-500 font-mono">{data.cidr}</div>}
          {data.subtext && !data.cidr && (
            <div className="text-[10px] text-slate-500 font-mono truncate">{data.subtext}</div>
          )}
        </div>
      </div>

      {/* Node Details (p2.txt: Name, CIDR, Status, EC2 count, TGW attachment status) */}
      {data.isVpc && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status:</span>
            <span
              className={`font-semibold px-1.5 py-0.2 rounded ${
                data.status === 'Warning'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {data.status || 'Healthy'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">EC2 Instances:</span>
            <span className="font-semibold text-slate-700">{data.ec2Count ?? 1} node</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">TGW Attachment:</span>
            <span className="font-semibold text-blue-600">
              {data.attachmentStatus || 'Attached'}
            </span>
          </div>
        </div>
      )}

      {/* TGW Specific Details */}
      {data.type === 'tgw' && (
        <div className="mt-2.5 pt-2 border-t border-blue-100/80 flex items-center justify-between text-[10px]">
          <span className="text-slate-500">State:</span>
          <span className="font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
            {data.status || 'Available'}
          </span>
        </div>
      )}
    </div>
  );
};

export default NetworkNode;
