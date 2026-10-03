import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import TopologyGraph from '../components/network/TopologyGraph';
import VpcDetailModal from '../components/network/VpcDetailModal';
import { MOCK_VPCS } from '../data/mockData';
import { Info, ZoomIn, Share2, Layers } from 'lucide-react';

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

      {/* Legend & Guide Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">Topology Legend:</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600">Enterprise-TGW Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-400" />
            <span className="text-slate-600">Dev VPC (10.10.0.0/16)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400" />
            <span className="text-slate-600">Test VPC (10.20.0.0/16)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-slate-600">Prod VPC (10.30.0.0/16)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <Info className="w-4 h-4 text-blue-500" />
          <span>Solid lines indicate TGW Attachments; Dashed lines indicate workload instances</span>
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
