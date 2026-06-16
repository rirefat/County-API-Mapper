import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PerformanceMetric } from '../types';
import { HISTORICAL_CHART_DATA } from '../utils/countyData';
import { Activity, Clock, AreaChart } from 'lucide-react';
import { motion } from 'motion/react';

interface APIChartsProps {
  chartData?: PerformanceMetric[];
}

export default function APICharts({ chartData = HISTORICAL_CHART_DATA }: APIChartsProps) {
  const [activeTab, setActiveTab] = useState<'volume' | 'latency'>('volume');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div id="recharts-custom-tooltip" className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xl text-xs font-mono text-slate-200">
          <p className="font-bold text-slate-400 mb-2 border-b border-slate-800 pb-1">Date: {label}</p>
          {payload.map((pld: any) => (
            <p key={pld.name} className="flex justify-between gap-6 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: pld.color }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: pld.color }} />
                {pld.name}:
              </span>
              <span className="font-bold text-white">{pld.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      id="api-charts-card"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-6 h-full flex flex-col justify-between"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AreaChart className="text-indigo-400" size={20} />
            Telemetry Logs & Trends
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Historical overview of synchronized county mapping operations
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1 self-start">
          <button
            id="chart-tab-volume"
            onClick={() => setActiveTab('volume')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'volume'
                ? 'bg-white/15 text-white border border-white/10 shadow-inner'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity size={14} />
            Fetch Volume
          </button>
          <button
            id="chart-tab-latency"
            onClick={() => setActiveTab('latency')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'latency'
                ? 'bg-white/15 text-white border border-white/10 shadow-inner'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock size={14} />
            Response Latency
          </button>
        </div>
      </div>

      <div className="h-80 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'volume' ? (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="successColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }}
              />
              <Line
                name="Aggregated API Queries"
                type="monotone"
                dataKey="totalCalls"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1.5 }}
                activeDot={{ r: 6 }}
              />
              <Line
                name="Successful Deliveries"
                type="monotone"
                dataKey="successfulCalls"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1.5 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value}ms`}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }}
              />
              <Line
                name="Average Latency"
                type="monotone"
                dataKey="averageLatencyMs"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1.5 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-1.5 mt-4 p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping shrink-0" />
        <span className="font-semibold">
          Continuous Cron status check loops every hour. Average latency remains optimized &lt; 200ms.
        </span>
      </div>
    </motion.div>
  );
}
