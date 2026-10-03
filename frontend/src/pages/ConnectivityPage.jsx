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
  CheckSquare,
  ListTree,
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
      
      const isReachable = res.status === 'REACHABLE' || res.status === 'SUCCESS' || res.statusCode === 200;
      const isBlocked = res.status === 'BLOCKED' || res.statusCode === 403;
      const isUnreachable = res.status === 'UNREACHABLE' || isBlocked;
      const isTimeout = res.status === 'TIMEOUT';
      const isNotAvailable = res.status === 'NOT_AVAILABLE';
      
      let displayStatus = 'Unreachable';
      if (isReachable) displayStatus = 'Reachable';
      else if (isTimeout) displayStatus = 'Timeout';
      else if (isNotAvailable) displayStatus = 'Not Available';
      else if (isUnreachable) displayStatus = 'Unreachable';
      else if (res.status) displayStatus = res.status;

      const diagMessage = res.diagnosticMessage || res.message || 'Connectivity inspection completed';
      const latencyVal = res.latency != null ? `${res.latency} ms` : res.latencyMs != null ? `${res.latencyMs} ms` : 'Not measured (passive topology verification)';

      setResult({
        ...res,
        displayStatus,
        protocol: res.protocol || protocol,
        source: res.source || sourceVpc,
        destination: res.destination || destinationVpc,
        port: res.port || port,
        latency: latencyVal,
        diagnosticMethod: res.diagnosticMethod || 'AWS-EC2-DESCRIBE',
        possibleCause: res.possibleCause || null,
        evidence: res.evidence || res.path || [],
        recommendedChecks: res.recommendedChecks || [],
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
        latency: 'Not measured',
        diagnosticMethod: 'AWS-EC2-DESCRIBE',
        possibleCause: 'UNKNOWN',
        evidence: [err.message || 'Diagnostic request encountered an error.'],
        recommendedChecks: ['Verify AWS credentials and Spring Boot backend connectivity'],
        timestamp: new Date().toLocaleTimeString(),
        diagnosticMessage: err.message || 'Diagnostic test failed to execute.',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Connectivity Diagnostics"
        subtitle="Real AWS network path validation and Transit Gateway reachability inspection."
        breadcrumbs={[{ label: 'Operations' }, { label: 'Connectivity Diagnostics' }]}
      />

      {/* AWS Environment Diagnostic Notice */}
      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          Real-time AWS network diagnostics. Evaluates live VPC route tables, Transit Gateway attachments, security groups, and environment isolation policies without fabricating latency.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>Diagnostic Configuration</span>
          </h3>

          {/* Source Environment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Source Environment
            </label>
            <select
              value={sourceVpc}
              onChange={(e) => setSourceVpc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="DEV">DEV VPC (10.10.0.0/16)</option>
              <option value="TEST">TEST VPC (10.20.0.0/16)</option>
              <option value="PROD">PROD VPC (10.30.0.0/16)</option>
            </select>
          </div>

          {/* Destination Environment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Destination Environment
            </label>
            <select
              value={destinationVpc}
              onChange={(e) => setDestinationVpc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="DEV">DEV VPC (10.10.0.0/16)</option>
              <option value="TEST">TEST VPC (10.20.0.0/16)</option>
              <option value="PROD">PROD VPC (10.30.0.0/16)</option>
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
                <option value="HTTPS">HTTPS</option>
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
            <span>{testing ? 'Analyzing Route Topology...' : 'Run Diagnostics'}</span>
          </button>

          {sourceVpc === destinationVpc && (
            <p className="text-[11px] text-amber-600 text-center font-medium">
              Select different source and destination VPCs to test cross-VPC Transit Gateway routing.
            </p>
          )}

          {/* Visual Step Representation */}
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
                <span>Enterprise Transit Gateway</span>
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
                        : result.displayStatus === 'Timeout' || result.displayStatus === 'Not Available'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {result.displayStatus}
                  </span>
                )}
              </div>

              {result ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      result.displayStatus === 'Reachable'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : result.displayStatus === 'Unreachable'
                        ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                        : 'bg-amber-50/80 border-amber-200 text-amber-950'
                    }`}
                  >
                    {result.displayStatus === 'Reachable' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : result.displayStatus === 'Unreachable' ? (
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold">
                        {result.displayStatus === 'Reachable'
                          ? 'Path Reachable — 200 OK'
                          : result.displayStatus === 'Unreachable'
                          ? 'Path Unreachable — Blocked or Missing Route'
                          : 'Diagnostic Status: ' + result.displayStatus}
                      </h4>
                      <p className="text-xs mt-1 text-slate-700 leading-relaxed font-mono">
                        {result.diagnosticMessage}
                      </p>
                      {result.possibleCause && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 border border-amber-300 text-amber-800 rounded-md text-[11px] font-semibold">
                          <span>Possible Cause:</span>
                          <span className="font-mono">{result.possibleCause}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Result Detail Fields Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Diagnostic Method</span>
                      <span className="font-mono font-semibold text-slate-800">{result.diagnosticMethod}</span>
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
                      <span className="font-mono font-medium text-slate-700">{result.latency}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Timestamp</span>
                      <span className="font-mono text-slate-600">{result.timestamp}</span>
                    </div>
                  </div>

                  {/* Network Evidence Path (Blue) */}
                  {result.evidence && result.evidence.length > 0 && (
                    <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                      <h5 className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                        <ListTree className="w-3.5 h-3.5 text-blue-600" />
                        <span>Network Evidence & Evaluated Path</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-blue-950 font-mono">
                        {result.evidence.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Checks */}
                  {result.recommendedChecks && result.recommendedChecks.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-slate-600" />
                        <span>Recommended Next Checks</span>
                      </h5>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {result.recommendedChecks.map((chk, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-slate-400 font-bold">→</span>
                            <span>{chk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-16 text-center text-slate-400 text-xs">
                  <Terminal className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Select Source, Destination, Protocol, and Port then click "Run Diagnostics" to inspect AWS Transit Gateway reachability.
                </div>
              )}
            </div>

            {/* Zero-Trust Isolation Policy Summary */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                Zero-Trust Rules: DEV communicates with TEST; TEST communicates with PROD; DEV to PROD direct traffic is isolated by Security Group and routing policies.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectivityPage;
