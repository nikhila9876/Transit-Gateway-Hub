import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TgwStatusCard = ({ tgw }) => {
  if (!tgw) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{tgw.name}</h3>
            <span className="text-xs font-mono text-slate-500">{tgw.id}</span>
          </div>
        </div>
        <StatusBadge status={tgw.state} />
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500">Region</span>
          <span className="font-semibold text-slate-800">{tgw.region}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500">BGP ASN</span>
          <span className="font-mono text-slate-800">{tgw.asn}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500">VPC Attachments</span>
          <span className="font-semibold text-blue-600">{tgw.attachments?.length || 3} Active</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-slate-500">Routing Mode</span>
          <span className="font-medium text-slate-800">Dynamic Propagation</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          to="/transit-gateway"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between"
        >
          <span>View Transit Gateway Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default TgwStatusCard;
