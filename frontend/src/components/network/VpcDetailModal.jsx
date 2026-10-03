import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { Layers, Shield, Network } from 'lucide-react';

export const VpcDetailModal = ({ vpc, isOpen, onClose }) => {
  if (!vpc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${vpc.displayName || vpc.name} Details`} maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header overview */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="text-xl font-bold text-slate-900">{vpc.displayName || vpc.name}</div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">{vpc.id}</div>
          </div>
          <StatusBadge status={vpc.state} />
        </div>

        {/* Core Attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">IPv4 CIDR</span>
            <span className="font-mono font-semibold text-slate-800">{vpc.cidr}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Region</span>
            <span className="font-semibold text-slate-800">{vpc.region}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Security Group</span>
            <span className="font-semibold text-blue-600">{vpc.securityGroup}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">TGW Attachment</span>
            <span className="font-semibold text-emerald-600">{vpc.attachmentStatus}</span>
          </div>
        </div>

        {/* Subnets list */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Associated Subnets ({vpc.subnets?.length || 0})</span>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">CIDR Block</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Availability Zone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vpc.subnets?.map((subnet) => (
                  <tr key={subnet.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{subnet.name}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-600">{subnet.cidr}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        subnet.type === 'Public' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {subnet.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">{subnet.az}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Routing summary */}
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-900">
          <div className="font-semibold flex items-center gap-1.5 mb-1">
            <Network className="w-4 h-4 text-blue-600" />
            <span>Transit Gateway Routing Target</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Traffic destined outside this VPC's CIDR ({vpc.cidr}) targeting peer VPC CIDRs (10.10.0.0/16, 10.20.0.0/16, 10.30.0.0/16) is routed automatically via Enterprise-TGW.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default VpcDetailModal;
