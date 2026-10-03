import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecurityOverviewCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Security Posture</h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated architecture audit</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>86 / 100</span>
          </div>
        </div>

        {/* Breakdown: Critical, Warnings, Informational */}
        <div className="grid grid-cols-3 gap-2 text-center my-4">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
            <div className="flex items-center justify-center text-rose-600 mb-1">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-rose-700">1</div>
            <div className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider">Critical</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
            <div className="flex items-center justify-center text-amber-600 mb-1">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-amber-700">2</div>
            <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Warnings</div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100">
            <div className="flex items-center justify-center text-cyan-600 mb-1">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-cyan-700">3</div>
            <div className="text-[10px] font-semibold text-cyan-600 uppercase tracking-wider">Info</div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          DEV to PROD isolation policy is actively enforced. 1 public subnet exposure in PROD and broad SG rule in DEV flagged for review.
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          to="/security"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between group"
        >
          <span>View Security Center</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default SecurityOverviewCard;
