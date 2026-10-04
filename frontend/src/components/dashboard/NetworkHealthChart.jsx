import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MOCK_MONITORING } from '../../data/mockMonitoring';

export const NetworkHealthChart = () => {
  const [range, setRange] = useState('6H');
  const data = MOCK_MONITORING.ranges[range]?.healthScore || MOCK_MONITORING.ranges['6H'].healthScore;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Network Health</h3>
          <p className="text-xs text-slate-500 mt-0.5">Infrastructure health over time</p>
        </div>

        {/* Time Range Controls: 1H, 6H, 24H, 7D */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['1H', '6H', '24H', '7D'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                range === r
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              domain={[80, 100]}
              tickLine={false}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`, 'Health Score']}
            />
            <Area
              type="monotone"
              dataKey="score"
              name="Health Score"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#healthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-700">Healthy Operating Boundary (90%+)</span>
        </div>
        <span className="font-mono text-[11px]">Current: 94% Nominal</span>
      </div>
    </div>
  );
};

export default NetworkHealthChart;
