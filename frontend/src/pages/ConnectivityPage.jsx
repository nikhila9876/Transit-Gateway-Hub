import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { connectivityService } from '../services/connectivityService';
import { Play, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Terminal } from 'lucide-react';

export const ConnectivityPage = () => {
  const [sourceVpc, setSourceVpc] = useState('DEV');
  const [destinationVpc, setDestinationVpc] = useState('TEST');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await connectivityService.testConnectivity(sourceVpc, destinationVpc, 8080);
      setResult(res);
    } catch (err) {
      setResult({
        status: 'ERROR',
        message: err.message || 'Connectivity probe failed',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-VPC Connectivity Testing"
        subtitle="Simulate and verify private IP reachability and security group enforcement through Transit Gateway."
        breadcrumbs={[{ label: 'Operations' }, { label: 'Connectivity' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Configuration Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>Synthetic Probe Configuration</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Source Environment
            </label>
            <select
              value={sourceVpc}
              onChange={(e) => setSourceVpc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="DEV">DEV VPC (10.10.1.45)</option>
              <option value="TEST">TEST VPC (10.20.1.88)</option>
              <option value="PROD">PROD VPC (10.30.1.112)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Destination Environment
            </label>
            <select
              value={destinationVpc}
              onChange={(e) => setDestinationVpc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="DEV">DEV VPC (10.10.1.45)</option>
              <option value="TEST">TEST VPC (10.20.1.88)</option>
              <option value="PROD">PROD VPC (10.30.1.112)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Service Port
            </label>
            <input
              type="text"
              readOnly
              value="8080 (HTTP Private App)"
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono"
            >
            </input>
          </div>

          <button
            onClick={runTest}
            disabled={testing || sourceVpc === destinationVpc}
            className="w-full mt-4 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{testing ? 'Executing Probe...' : 'Execute Connectivity Test'}</span>
          </button>

          {sourceVpc === destinationVpc && (
            <p className="text-[11px] text-amber-600 text-center">
              Please select different source and destination VPCs to test cross-VPC routing.
            </p>
          )}
        </div>

        {/* Results Display */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Synthetic Probe Result</h3>
              {result && (
                <StatusBadge
                  status={result.status === 'SUCCESS' ? 'healthy' : 'critical'}
                  text={result.status}
                />
              )}
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Result header */}
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    result.status === 'SUCCESS'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {result.status === 'SUCCESS' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {result.status === 'SUCCESS' ? 'Connection Succeeded (200 OK)' : 'Traffic Blocked by Policy (403)'}
                    </h4>
                    <p className="text-xs mt-1 font-mono">{result.message}</p>
                    {result.latencyMs && (
                      <div className="text-[11px] text-slate-500 mt-2 font-mono">
                        Latency: <span className="font-bold text-emerald-700">{result.latencyMs} ms</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Packet Path Visualizer */}
                {result.path && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block mb-2">Evaluated Packet Hop Path</span>
                    <div className="flex flex-col sm:flex-row items-center gap-2 text-xs font-mono">
                      {result.path.map((hop, idx) => (
                        <React.Fragment key={idx}>
                          <span className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs text-slate-800">
                            {hop}
                          </span>
                          {idx < result.path.length - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 rotate-90 sm:rotate-0 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                Select environments and click "Execute Connectivity Test" to simulate cross-VPC curl over Transit Gateway.
              </div>
            )}
          </div>

          {/* Policy Context Reference */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>
              Expected Security Architecture: DEV communicates with TEST; TEST communicates with PROD; DEV to PROD is restricted by Prod-App-SG policy.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectivityPage;
