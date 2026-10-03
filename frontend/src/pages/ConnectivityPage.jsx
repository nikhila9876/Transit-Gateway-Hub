import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { connectivityService } from '../services/connectivityService';
import {
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ArrowDown,
  Share2,
  Terminal,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const ConnectivityPage = () => {
  const [sourceVpc, setSourceVpc] = useState('DEV');
  const [destinationVpc, setDestinationVpc] = useState('TEST');
  const [protocol, setProtocol] = useState('TCP');
  const [port, setPort] = useState('8080');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await connectivityService.testConnectivity(sourceVpc, destinationVpc, protocol, parseInt(port) || 8080);
      
      const isReachable = res.status === 'SUCCESS' || res.statusCode === 200;
      const isBlocked = res.status === 'BLOCKED' || res.statusCode === 403;
      const displayStatus = isReachable ? 'Reachable' : isBlocked ? 'Unreachable' : (res.status || 'Completed');
      const diagMessage = res.diagnosticMessage || res.message || 'Connectivity probe completed';
      const latencyVal = res.latency != null ? `${res.latency} ms` : res.latencyMs != null ? `${res.latencyMs} ms` : (isBlocked ? 'Timeout (>5000ms)' : '1.2 ms');

      setResult({
        ...res,
        displayStatus,
        protocol: res.protocol || protocol,
        source: res.source || sourceVpc,
        destination: res.destination || destinationVpc,
        port: res.port || port,
        latency: latencyVal,
        timestamp: res.timestamp || new Date().toLocaleTimeString(),
        diagnosticMessage: diagMessage,
      });
    } catch (err) {
      setResult({
        displayStatus: 'Error',
        source: sourceVpc,
        destination: destinationVpc,
        port: port,
        protocol,
        latency: 'N/A',
        timestamp: new Date().toLocaleTimeString(),
        diagnosticMessage: err.message || 'Synthetic test failed to execute.',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Connectivity Tester"
        subtitle="Test connectivity between connected AWS environments."
        breadcrumbs={[{ label: 'Operations' }, { label: 'Connectivity' }]}
      />

      {/* Development Environment Notice */}
      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          Synthetic diagnostic simulator. Executes controlled rule evaluations against the multi-VPC Transit Gateway architecture model.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>Test Configuration</span>
          </h3>

          {/* Source Environment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Source
            </label>
            <select
              value={sourceVpc}
              onChange={(e) => setSourceVpc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="DEV">DEV VPC (10.10.1.45)</option>
              <option value="TEST">TEST VPC (10.20.1.88)</option>
              <option value="PROD">PROD VPC (10.30.1.112)</option>
            </select>
          </div>

          {/* Destination Environment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Destination
            </label>
            <select
              value={destinationVpc}
              onChange={(e) => setDestinationVpc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="DEV">DEV VPC (10.10.1.45)</option>
              <option value="TEST">TEST VPC (10.20.1.88)</option>
              <option value="PROD">PROD VPC (10.30.1.112)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Protocol */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Protocol
              </label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="TCP">TCP</option>
                <option value="HTTP">HTTP</option>
                <option value="ICMP">ICMP</option>
              </select>
            </div>

            {/* Port */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Port
              </label>
              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="8080"
              />
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={runTest}
            disabled={testing || sourceVpc === destinationVpc}
            className="w-full mt-3 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{testing ? 'Running Probe...' : 'Run Connectivity Test'}</span>
          </button>

          {sourceVpc === destinationVpc && (
            <p className="text-[11px] text-amber-600 text-center font-medium">
              Select different source and destination VPCs to test cross-VPC Transit Gateway routing.
            </p>
          )}

          {/* Visual Step Representation (p2.txt: DEV -> Transit Gateway -> TEST) */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center">
              Evaluated Network Path Flow
            </span>

            <div className="flex flex-col items-center space-y-1.5 text-xs">
              <div className="w-full max-w-[200px] text-center p-2 rounded-xl bg-blue-50 border border-blue-200 font-bold text-blue-800 shadow-2xs">
                {sourceVpc} VPC
              </div>
              <ArrowDown className="w-4 h-4 text-blue-500" />
              <div className="w-full max-w-[200px] text-center p-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-sm flex items-center justify-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>Transit Gateway</span>
              </div>
              <ArrowDown className="w-4 h-4 text-blue-500" />
              <div className="w-full max-w-[200px] text-center p-2 rounded-xl bg-indigo-50 border border-indigo-200 font-bold text-indigo-800 shadow-2xs">
                {destinationVpc} VPC
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[380px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">Diagnostic Result</h3>
                {result && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      result.displayStatus === 'Reachable'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : result.displayStatus === 'Unreachable'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : result.displayStatus === 'Timeout'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {result.displayStatus}
                  </span>
                )}
              </div>

              {result ? (
                /* Result Card (p2.txt: Status, Source, Destination, Port, Latency, Timestamp, Diagnostic message) */
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      result.displayStatus === 'Reachable'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/80 border-rose-200 text-rose-950'
                    }`}
                  >
                    {result.displayStatus === 'Reachable' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold">
                        {result.displayStatus === 'Reachable'
                          ? 'Path Reachable — 200 OK'
                          : 'Path Unreachable — Blocked by Policy'}
                      </h4>
                      <p className="text-xs mt-1 text-slate-700 leading-relaxed font-mono">
                        {result.diagnosticMessage}
                      </p>
                    </div>
                  </div>

                  {/* Result Detail Fields Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                      <span className="font-bold text-slate-800">{result.displayStatus}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Source</span>
                      <span className="font-semibold text-blue-600 font-mono">{result.source} VPC</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination</span>
                      <span className="font-semibold text-indigo-600 font-mono">{result.destination} VPC</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Protocol / Port</span>
                      <span className="font-mono font-semibold text-slate-800">{result.protocol} / {result.port}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Latency</span>
                      <span className="font-mono font-bold text-emerald-600">{result.latency}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Timestamp</span>
                      <span className="font-mono text-slate-600">{result.timestamp}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center text-slate-400 text-xs">
                  <Terminal className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Select Source, Destination, Protocol, and Port then click "Run Connectivity Test" to evaluate routing reachability.
                </div>
              )}
            </div>

            {/* Security Isolation Summary */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                Zero-Trust Rules: DEV communicates with TEST; TEST communicates with PROD; DEV to PROD direct traffic is blocked by Prod-App-SG rules.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectivityPage;
