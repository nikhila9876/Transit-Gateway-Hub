import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NetworkNode from '../common/NetworkNode';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

const nodeTypes = {
  networkNode: NetworkNode,
};

const CustomControlsBar = () => {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();

  const handleReset = () => {
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 400 });
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-xl border border-slate-200 shadow-md">
      <button
        onClick={() => zoomIn({ duration: 300 })}
        title="Zoom in"
        aria-label="Zoom in"
        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={() => zoomOut({ duration: 300 })}
        title="Zoom out"
        aria-label="Zoom out"
        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={() => fitView({ duration: 400, padding: 0.2 })}
        title="Fit view"
        aria-label="Fit view"
        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
      <button
        onClick={handleReset}
        title="Reset view"
        aria-label="Reset view"
        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};

export const TopologyGraphInner = ({ onNodeClick }) => {
  // Hub-and-Spoke layout as required in p2.txt:
  // DEV at top -> Enterprise-TGW in center -> TEST & PROD at bottom
  const initialNodes = useMemo(
    () => [
      // DEV VPC (Top)
      {
        id: 'dev-vpc',
        type: 'networkNode',
        position: { x: 380, y: 30 },
        data: {
          label: 'Dev-VPC',
          cidr: '10.10.0.0/16',
          icon: 'Layers',
          type: 'vpc_dev',
          isVpc: true,
          status: 'Healthy',
          ec2Count: 1,
          attachmentStatus: 'Attached',
        },
      },
      // DEV App Server
      {
        id: 'dev-ec2',
        type: 'networkNode',
        position: { x: 120, y: 30 },
        data: {
          label: 'Dev-App-Server',
          subtext: '10.10.1.45 :8080',
          icon: 'Server',
          type: 'ec2',
          status: 'Running',
        },
      },
      // Central Hub: Enterprise-TGW
      {
        id: 'tgw',
        type: 'networkNode',
        position: { x: 380, y: 200 },
        data: {
          label: 'Enterprise-TGW',
          subtext: 'Transit Gateway Hub (us-east-1)',
          icon: 'Share2',
          type: 'tgw',
          status: 'Available',
        },
      },
      // TEST VPC (Bottom Left)
      {
        id: 'test-vpc',
        type: 'networkNode',
        position: { x: 140, y: 370 },
        data: {
          label: 'Test-VPC',
          cidr: '10.20.0.0/16',
          icon: 'Layers',
          type: 'vpc_test',
          isVpc: true,
          status: 'Healthy',
          ec2Count: 1,
          attachmentStatus: 'Attached',
        },
      },
      // TEST App Server
      {
        id: 'test-ec2',
        type: 'networkNode',
        position: { x: 140, y: 530 },
        data: {
          label: 'Test-App-Server',
          subtext: '10.20.1.88 :8080',
          icon: 'Server',
          type: 'ec2',
          status: 'Running',
        },
      },
      // PROD VPC (Bottom Right)
      {
        id: 'prod-vpc',
        type: 'networkNode',
        position: { x: 620, y: 370 },
        data: {
          label: 'Prod-VPC',
          cidr: '10.30.0.0/16',
          icon: 'Layers',
          type: 'vpc_prod',
          isVpc: true,
          status: 'Warning',
          ec2Count: 1,
          attachmentStatus: 'Attached',
        },
      },
      // PROD App Server
      {
        id: 'prod-ec2',
        type: 'networkNode',
        position: { x: 620, y: 530 },
        data: {
          label: 'Prod-App-Server',
          subtext: '10.30.1.112 :8080',
          icon: 'Server',
          type: 'ec2',
          status: 'Running',
        },
      },
    ],
    []
  );

  const initialEdges = useMemo(
    () => [
      // DEV to TGW (Healthy green connection)
      {
        id: 'e-dev-tgw',
        source: 'dev-vpc',
        target: 'tgw',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      },
      // TGW to TEST (Healthy green connection)
      {
        id: 'e-tgw-test',
        source: 'tgw',
        target: 'test-vpc',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      },
      // TGW to PROD (Warning amber connection - DEV to PROD direct traffic isolated)
      {
        id: 'e-tgw-prod',
        source: 'tgw',
        target: 'prod-vpc',
        animated: true,
        style: { stroke: '#f59e0b', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
      },
      // DEV to EC2 workload
      {
        id: 'e-dev-ec2',
        source: 'dev-vpc',
        target: 'dev-ec2',
        style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      },
      // TEST to EC2 workload
      {
        id: 'e-test-ec2',
        source: 'test-vpc',
        target: 'test-ec2',
        style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      },
      // PROD to EC2 workload
      {
        id: 'e-prod-ec2',
        source: 'prod-vpc',
        target: 'prod-ec2',
        style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      },
    ],
    []
  );

  return (
    <div className="w-full h-[640px] bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
      <CustomControlsBar />

      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        onNodeClick={(e, node) => onNodeClick && onNodeClick(node)}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#cbd5e1" gap={16} size={1} />
        <MiniMap
          nodeColor={(n) => {
            if (n.id === 'tgw') return '#2563eb';
            if (n.id.includes('prod')) return '#6366f1';
            if (n.id.includes('test')) return '#06b6d4';
            if (n.id.includes('dev')) return '#3b82f6';
            if (n.id.includes('ec2')) return '#10b981';
            return '#64748b';
          }}
          className="!bg-white !border !border-slate-200 !rounded-xl !shadow-sm"
        />
      </ReactFlow>
    </div>
  );
};

export const TopologyGraph = (props) => (
  <ReactFlowProvider>
    <TopologyGraphInner {...props} />
  </ReactFlowProvider>
);

export default TopologyGraph;
