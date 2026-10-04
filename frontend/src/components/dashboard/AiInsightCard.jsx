import React from 'react';
import { Sparkles, ArrowRight, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AiInsightCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50/40 rounded-2xl border border-purple-200/80 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
      {/* Decorative subtle background aura */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-purple-200/40 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">CloudNexus Intelligence</h3>
            <span className="text-[10px] text-purple-700 font-semibold uppercase tracking-wider">Automated Recommendation</span>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium mt-3 bg-white/70 p-3 rounded-xl border border-purple-100/80">
          "Network analysis detected a possible connectivity issue between DEV and TEST. Review the relevant route tables and security group rules."
        </p>

        <p className="text-[11px] text-slate-500 mt-2">
          Diagnostic checks indicate route table propagation is healthy; verify port 8080 ingress on Dev-App-SG.
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-purple-100 flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate('/connectivity')}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Analyze Network</span>
        </button>

        <Link
          to="/ai-assistant"
          className="px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <span>Open AI Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default AiInsightCard;
