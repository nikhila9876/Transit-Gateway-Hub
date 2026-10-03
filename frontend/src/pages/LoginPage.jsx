import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudLightning, Lock, User, Shield, Info, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';

export const LoginPage = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Brand Header */}
      <div className="p-8 text-center bg-gradient-to-b from-blue-50/50 to-white border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
          <CloudLightning className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{APP_NAME}</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">{APP_TAGLINE}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Username
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
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 transition"
        >
          <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Console'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Demo Credentials Quick-Select */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Role-Based Access Presets</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPresetUser('admin', 'Admin@123')}
              className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50/40 transition"
            >
              <div className="font-semibold text-slate-800">Admin Account</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">admin / Admin@123</div>
            </button>
            <button
              type="button"
              onClick={() => setPresetUser('viewer', 'Viewer@123')}
              className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50/40 transition"
            >
              <div className="font-semibold text-slate-800">Viewer Account</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">viewer / Viewer@123</div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
