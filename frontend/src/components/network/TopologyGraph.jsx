import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NetworkNode from '../common/NetworkNode';

const nodeTypes = {
  networkNode: NetworkNode,
};

export const TopologyGraph = ({ onNodeClick }) => {
  // Preconfigured layout showing Transit Gateway connected to DEV, TEST, PROD and their workloads
  const initialNodes = useMemo(
    () => [
      // Central Hub
      {
        id: 'tgw',
        type: 'networkNode',
        position: { x: 380, y: 40 },
        data: {
          label: 'Enterprise-TGW',
          subtext: 'Transit Gateway Hub',
          icon: 'Share2',
          type: 'tgw',
          status: 'Available',
        },
      },
      // DEV VPC Spoke
      {
        id: 'dev-vpc',
        type: 'networkNode',
        position: { x: 80, y: 220 },
        data: {
          label: 'Dev-VPC',
          subtext: '10.10.0.0/16',
          icon: 'Layers',
          type: 'vpc_dev',
          status: 'Attached',
        },
      },
      // TEST VPC Spoke
      {
        id: 'test-vpc',
        type: 'networkNode',
        position: { x: 380, y: 220 },
        data: {
          label: 'Test-VPC',
          subtext: '10.20.0.0/16',
          icon: 'Layers',
          type: 'vpc_test',
          status: 'Attached',
        },
      },
      // PROD VPC Spoke
      {
        id: 'prod-vpc',
        type: 'networkNode',
        position: { x: 680, y: 220 },
        data: {
          label: 'Prod-VPC',
          subtext: '10.30.0.0/16',
          icon: 'Layers',
          type: 'vpc_prod',
          status: 'Attached',
        },
      },
      // DEV App Server
      {
        id: 'dev-ec2',
        type: 'networkNode',
        position: { x: 80, y: 390 },
        data: {
          label: 'Dev-App-Server',
          subtext: '10.10.1.45 :8080',
          icon: 'Server',
          type: 'ec2',
          status: 'Running',
        },
      },
      // TEST App Server
      {
        id: 'test-ec2',
        type: 'networkNode',
        position: { x: 380, y: 390 },
        data: {
          label: 'Test-App-Server',
          subtext: '10.20.1.88 :8080',
          icon: 'Server',
          type: 'ec2',
          status: 'Running',
        },
      },
      // PROD App Server
      {
        id: 'prod-ec2',
        type: 'networkNode',
        position: { x: 680, y: 390 },
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
      // TGW to DEV
      {
        id: 'e-tgw-dev',
        source: 'tgw',
        target: 'dev-vpc',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      },
      // TGW to TEST
      {
        id: 'e-tgw-test',
        source: 'tgw',
        target: 'test-vpc',
        animated: true,
        style: { stroke: '#06b6d4', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
      },
      // TGW to PROD
      {
        id: 'e-tgw-prod',
        source: 'tgw',
        target: 'prod-vpc',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
      },
      // DEV to EC2
      {
        id: 'e-dev-ec2',
        source: 'dev-vpc',
        target: 'dev-ec2',
        style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      },
      // TEST to EC2
      {
        id: 'e-test-ec2',
        source: 'test-vpc',
        target: 'test-ec2',
        style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      },
      // PROD to EC2
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
    <div className="w-full h-[580px] bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        onNodeClick={(e, node) => onNodeClick && onNodeClick(node)}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#cbd5e1" gap={16} size={1} />
        <Controls className="!bg-white !border !border-slate-200 !shadow-sm !rounded-lg" />
        <MiniMap
          nodeColor={(n) => {
            if (n.id === 'tgw') return '#3b82f6';
            if (n.id.includes('ec2')) return '#10b981';
            return '#64748b';
          }}
          className="!bg-white !border !border-slate-200 !rounded-lg !shadow-sm"
        />
      </ReactFlow>
    </div>
  );
};

export default TopologyGraph;
