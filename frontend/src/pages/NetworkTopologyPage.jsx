import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import TopologyGraph from '../components/network/TopologyGraph';
import VpcDetailModal from '../components/network/VpcDetailModal';
import { MOCK_VPCS } from '../data/mockVpcs';
import { Info, ZoomIn, Layers, Share2, Server } from 'lucide-react';

export const NetworkTopologyPage = () => {
  const [selectedVpc, setSelectedVpc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNodeClick = (node) => {
    if (node.id.includes('dev')) {
      setSelectedVpc(MOCK_VPCS.find((v) => v.name === 'DEV'));
      setIsModalOpen(true);
    } else if (node.id.includes('test')) {
      setSelectedVpc(MOCK_VPCS.find((v) => v.name === 'TEST'));
      setIsModalOpen(true);
    } else if (node.id.includes('prod')) {
      setSelectedVpc(MOCK_VPCS.find((v) => v.name === 'PROD'));
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive Network Topology"
        subtitle="Visual map of Transit Gateway Hub-and-Spoke interconnects and attached VPC environments."
        breadcrumbs={[{ label: 'Network' }, { label: 'Topology' }]}
        actions={
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive: Drag canvas or click nodes to inspect</span>
          </div>
        }
      />

      {/* Legend & Guide Bar (Strictly as specified in p2.txt) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-5">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Legend:</span>
          
          {/* Blue: Network */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-100" />
            <span className="text-slate-700 font-medium">Blue: Network / TGW</span>
          </div>

          {/* Green: Healthy */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span className="text-slate-700 font-medium">Green: Healthy</span>
          </div>

          {/* Amber: Warning */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-100" />
            <span className="text-slate-700 font-medium">Amber: Warning</span>
          </div>

          {/* Red: Failed */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-100" />
            <span className="text-slate-700 font-medium">Red: Failed</span>
          </div>

          {/* Purple: AI/Intelligence */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600 ring-2 ring-purple-100" />
            <span className="text-slate-700 font-medium">Purple: AI/Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span>Click any VPC node to view subnets, routes, and security groups</span>
        </div>
      </div>

      {/* React Flow Graph */}
      <TopologyGraph onNodeClick={handleNodeClick} />

      {/* VPC Detail Modal */}
      <VpcDetailModal
        vpc={selectedVpc}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default NetworkTopologyPage;
