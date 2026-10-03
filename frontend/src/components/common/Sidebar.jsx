import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  Layers,
  Share2,
  GitFork,
  Server,
  Activity,
  LineChart,
  ShieldCheck,
  Sparkles,
  FileText,
  CloudLightning,
  LogOut,
  Circle,
} from 'lucide-react';
import { NAVIGATION_ITEMS, APP_NAME } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

const ICON_MAP = {
  LayoutDashboard,
  Network,
  Layers,
  Share2,
  GitFork,
  Server,
  Activity,
  LineChart,
  ShieldCheck,
  Sparkles,
  FileText,
};

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <CloudLightning className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base tracking-tight">{APP_NAME}</div>
            <div className="text-[11px] text-slate-500 font-medium tracking-tight">Network Intelligence</div>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-5" aria-label="Main Navigation">
          {NAVIGATION_ITEMS.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.category}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = ICON_MAP[item.icon] || Circle;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-blue-50/90 text-blue-700 font-semibold border-l-2 border-blue-600 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section: System Status & User Profile */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          {/* System Status Indicator */}
          <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-200/80 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-700">Hub Active</span>
            </div>
            <span className="font-mono text-slate-500 text-[10px]">us-east-1</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                {user?.username ? user.username.charAt(0) : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.username || 'admin'}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider truncate">
                  Role: {user?.role === 'ROLE_VIEWER' ? 'VIEWER' : 'ADMIN'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
