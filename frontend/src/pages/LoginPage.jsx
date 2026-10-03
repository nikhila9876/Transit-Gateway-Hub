import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudLightning,
  Lock,
  User,
  Shield,
  ArrowRight,
  Share2,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';

export const LoginPage = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(username, password);
      addToast(`Authenticated as ${username}`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Authentication failed. Please verify credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPresetUser = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
      {/* Left Column: CloudNexus Branding & Subtle Network Visual Elements */}
      <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">{APP_NAME}</span>
              <span className="block text-[11px] text-blue-300 font-mono">Network Intelligence</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Enterprise Multi-VPC Network Platform
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              A unified control plane to visualize, route, secure, and inspect complex AWS Transit Gateway
              topologies across DEV, TEST, and PROD environments.
            </p>
          </div>
        </div>

        {/* Subtle Networking Architecture Visual Element */}
        <div className="my-8 relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
          <div className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            <span>Transit Gateway Architecture</span>
          </div>

          <div className="flex items-center justify-between text-center text-xs">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
              <div className="font-bold text-blue-300">DEV VPC</div>
              <div className="text-[10px] font-mono text-slate-400">10.10.0.0/16</div>
            </div>

            <div className="text-slate-400 text-xs px-1 font-mono">⟷</div>

            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <div className="font-bold">Enterprise-TGW</div>
              <div className="text-[10px] text-blue-200">Hub us-east-1</div>
            </div>

            <div className="text-slate-400 text-xs px-1 font-mono">⟷</div>

            <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30">
              <div className="font-bold text-indigo-300">PROD VPC</div>
              <div className="text-[10px] font-mono text-slate-400">10.30.0.0/16</div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Autonomous route table propagation & verification</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Zero-Trust security group policy enforcement</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>AI-assisted root cause analysis & diagnostics</span>
          </div>
        </div>
      </div>

      {/* Right Column: Professional Login Card */}
      <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sign In to Console</h3>
              <p className="text-xs text-slate-500 mt-0.5">Enter your credentials to access the network hub</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Secure enterprise access</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
                  placeholder="admin or viewer"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => addToast('Please use demo accounts: Admin@123 or Viewer@123', 'info')}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 transition-colors"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Demo Credentials Quick-Select */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Quick Role Presets (Mock Environment)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPresetUser('admin', 'Admin@123')}
              className="p-2 border border-slate-200 rounded-xl text-left hover:border-blue-300 hover:bg-blue-50/40 transition shadow-2xs"
            >
              <div className="font-semibold text-slate-800">Admin Account</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">admin / Admin@123</div>
            </button>
            <button
              type="button"
              onClick={() => setPresetUser('viewer', 'Viewer@123')}
              className="p-2 border border-slate-200 rounded-xl text-left hover:border-blue-300 hover:bg-blue-50/40 transition shadow-2xs"
            >
              <div className="font-semibold text-slate-800">Viewer Account</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">viewer / Viewer@123</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
