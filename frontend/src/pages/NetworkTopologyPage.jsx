import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import TopologyGraph from '../components/network/TopologyGraph';
import VpcDetailModal from '../components/network/VpcDetailModal';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { vpcService } from '../services/vpcService';
import { transitGatewayService } from '../services/transitGatewayService';
import { ec2Service } from '../services/ec2Service';
import { MarkerType } from '@xyflow/react';
import { Info, ZoomIn, RefreshCw } from 'lucide-react';

export const NetworkTopologyPage = () => {
  const [vpcs, setVpcs] = useState([]);
  const [tgw, setTgw] = useState(null);
  const [ec2Instances, setEc2Instances] = useState([]);
  const [selectedVpc, setSelectedVpc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopologyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vpcsData, tgwData, ec2Data] = await Promise.all([
        vpcService.getVpcs(),
        transitGatewayService.getTransitGateway(),
        ec2Service.getInstances(),
      ]);

      setVpcs(Array.isArray(vpcsData) ? vpcsData : []);
      setTgw(tgwData);
      setEc2Instances(Array.isArray(ec2Data) ? ec2Data : []);
    } catch (err) {
      setError(err.message || 'Failed to load network topology data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopologyData();
  }, []);

  // Build dynamic nodes and edges from actual backend resources
  const { nodes, edges } = useMemo(() => {
    if (!vpcs || vpcs.length === 0) {
      return { nodes: [], edges: [] };
    }

    const tgwId = tgw?.id || 'tgw';
    const tgwName = tgw?.name || 'Enterprise-TGW';
    const tgwStatus = tgw?.state || tgw?.status || 'Available';
    const tgwRegion = tgw?.region || 'us-east-1';

    // Find VPCs
    const devVpc = vpcs.find((v) => v.name?.toUpperCase() === 'DEV' || v.displayName?.includes('DEV')) || vpcs[0];
    const testVpc = vpcs.find((v) => v.name?.toUpperCase() === 'TEST' || v.displayName?.includes('TEST')) || vpcs[1] || vpcs[0];
    const prodVpc = vpcs.find((v) => v.name?.toUpperCase() === 'PROD' || v.displayName?.includes('PROD')) || vpcs[2] || vpcs[0];

    // Find EC2 instances
    const devEc2 = ec2Instances.find((i) => i.environment === 'DEV' || i.vpcName === 'DEV' || i.name?.includes('Dev'));
    const testEc2 = ec2Instances.find((i) => i.environment === 'TEST' || i.vpcName === 'TEST' || i.name?.includes('Test'));
    const prodEc2 = ec2Instances.find((i) => i.environment === 'PROD' || i.vpcName === 'PROD' || i.name?.includes('Prod'));

    const dynamicNodes = [
      // DEV VPC (Top: x: 380, y: 30)
      {
        id: devVpc ? devVpc.id : 'dev-vpc',
        type: 'networkNode',
        position: { x: 380, y: 30 },
        data: {
          label: devVpc?.displayName || devVpc?.name || 'Dev-VPC',
          cidr: devVpc?.cidr || '10.10.0.0/16',
          icon: 'Layers',
          type: 'vpc_dev',
          isVpc: true,
          status: devVpc?.status || 'Healthy',
          ec2Count: devVpc?.ec2Count ?? 1,
          attachmentStatus: devVpc?.attachmentStatus || 'Attached',
          rawVpc: devVpc,
        },
      },
      // DEV EC2 Workload (Top Left: x: 120, y: 30)
      {
        id: devEc2?.id || 'dev-ec2',
        type: 'networkNode',
        position: { x: 120, y: 30 },
        data: {
          label: devEc2?.name || 'Dev-App-Server',
          subtext: `${devEc2?.privateIp || '10.10.1.45'} :8080`,
          icon: 'Server',
          type: 'ec2',
          status: devEc2?.state || 'Running',
        },
      },
      // Central Transit Gateway Hub (Center: x: 380, y: 220)
      {
        id: tgwId,
        type: 'networkNode',
        position: { x: 380, y: 220 },
        data: {
          label: tgwName,
          subtext: `Transit Gateway Hub (${tgwRegion}) • ASN ${tgw?.asn || 64512}`,
          icon: 'Share2',
          type: 'tgw',
          status: tgwStatus,
        },
      },
      // TEST VPC (Bottom Left: x: 140, y: 390)
      {
        id: testVpc ? testVpc.id : 'test-vpc',
        type: 'networkNode',
        position: { x: 140, y: 390 },
        data: {
          label: testVpc?.displayName || testVpc?.name || 'Test-VPC',
          cidr: testVpc?.cidr || '10.20.0.0/16',
          icon: 'Layers',
          type: 'vpc_test',
          isVpc: true,
          status: testVpc?.status || 'Healthy',
          ec2Count: testVpc?.ec2Count ?? 1,
          attachmentStatus: testVpc?.attachmentStatus || 'Attached',
          rawVpc: testVpc,
        },
      },
      // TEST EC2 Workload (Bottom Left subnode: x: 140, y: 550)
      {
        id: testEc2?.id || 'test-ec2',
        type: 'networkNode',
        position: { x: 140, y: 550 },
        data: {
          label: testEc2?.name || 'Test-App-Server',
          subtext: `${testEc2?.privateIp || '10.20.1.88'} :8080`,
          icon: 'Server',
          type: 'ec2',
          status: testEc2?.state || 'Running',
        },
      },
      // PROD VPC (Bottom Right: x: 620, y: 390)
      {
        id: prodVpc ? prodVpc.id : 'prod-vpc',
        type: 'networkNode',
        position: { x: 620, y: 390 },
        data: {
          label: prodVpc?.displayName || prodVpc?.name || 'Prod-VPC',
          cidr: prodVpc?.cidr || '10.30.0.0/16',
          icon: 'Layers',
          type: 'vpc_prod',
          isVpc: true,
          status: prodVpc?.status || 'Warning',
          ec2Count: prodVpc?.ec2Count ?? 1,
          attachmentStatus: prodVpc?.attachmentStatus || 'Attached',
          rawVpc: prodVpc,
        },
      },
      // PROD EC2 Workload (Bottom Right subnode: x: 620, y: 550)
      {
        id: prodEc2?.id || 'prod-ec2',
        type: 'networkNode',
        position: { x: 620, y: 550 },
        data: {
          label: prodEc2?.name || 'Prod-App-Server',
          subtext: `${prodEc2?.privateIp || '10.30.1.112'} :8080`,
          icon: 'Server',
          type: 'ec2',
          status: prodEc2?.state || 'Running',
        },
      },
    ];

    const dynamicEdges = [
      // DEV VPC <-> TGW (Healthy Green)
      {
        id: 'e-dev-tgw',
        source: devVpc ? devVpc.id : 'dev-vpc',
        target: tgwId,
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      },
      // TGW <-> TEST VPC (Healthy Green)
      {
        id: 'e-tgw-test',
        source: tgwId,
        target: testVpc ? testVpc.id : 'test-vpc',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      },
      // TGW <-> PROD VPC (Amber Warning - Isolated Direct Path)
      {
        id: 'e-tgw-prod',
        source: tgwId,
        target: prodVpc ? prodVpc.id : 'prod-vpc',
        animated: true,
        style: { stroke: '#f59e0b', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
      },
      // DEV to EC2
      {
        id: 'e-dev-ec2',
        source: devVpc ? devVpc.id : 'dev-vpc',
        target: devEc2?.id || 'dev-ec2',
        style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      },
      // TEST to EC2
      {
        id: 'e-test-ec2',
        source: testVpc ? testVpc.id : 'test-vpc',
        target: testEc2?.id || 'test-ec2',
        style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      },
      // PROD to EC2
      {
        id: 'e-prod-ec2',
        source: prodVpc ? prodVpc.id : 'prod-vpc',
        target: prodEc2?.id || 'prod-ec2',
        style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      },
    ];

    return { nodes: dynamicNodes, edges: dynamicEdges };
  }, [vpcs, tgw, ec2Instances]);

  const handleNodeClick = async (node) => {
    // If node is a VPC or has attached rawVpc
    if (node?.data?.rawVpc) {
      setSelectedVpc(node.data.rawVpc);
      setIsModalOpen(true);
      // Fetch fresh full details by ID
      try {
        const full = await vpcService.getVpcById(node.data.rawVpc.id);
        if (full) setSelectedVpc(full);
      } catch (e) {
        console.warn('Could not fetch detailed VPC data:', e.message);
      }
    } else if (node?.id) {
      // Find matching VPC by id or name
      const matched = vpcs.find((v) =>
        node.id.toLowerCase().includes(v.name.toLowerCase()) ||
        node.id === v.id
      );
      if (matched) {
        setSelectedVpc(matched);
        setIsModalOpen(true);
        try {
          const full = await vpcService.getVpcById(matched.id);
          if (full) setSelectedVpc(full);
        } catch (e) {
          console.warn('Could not fetch detailed VPC data:', e.message);
        }
      }
    }
  };

  if (loading) return <LoadingState message="Constructing network topology from backend infrastructure telemetry..." />;
  if (error) return <ErrorState message={error} onRetry={fetchTopologyData} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive Network Topology"
        subtitle="Visual map of Transit Gateway Hub-and-Spoke interconnects and attached VPC environments."
        breadcrumbs={[{ label: 'Network' }, { label: 'Topology' }]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={fetchTopologyData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Refresh Map</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
              <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
              <span>Interactive: Drag canvas or click nodes to inspect</span>
            </div>
          </div>
        }
      />

      {/* Legend & Guide Bar */}
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
          <span>Click any VPC node to view subnets, routes, and workload instances</span>
        </div>
      </div>

      {/* Dynamic React Flow Graph */}
      <TopologyGraph nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />

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
