import { useState } from 'react';
import { CountyAPI, APILog, PerformanceMetric } from './types';
import { INITIAL_COUNTIES, INITIAL_LOGS, HISTORICAL_CHART_DATA } from './utils/countyData';
import MetricCards from './components/MetricCards';
import APICharts from './components/APICharts';
import APIQuerySandbox from './components/APIQuerySandbox';
import APIMappingList from './components/APIMappingList';
import APIMappingForm from './components/APIMappingForm';
import APILogTicker from './components/APILogTicker';
import { ShieldCheck, Info, Sparkles, Network } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [counties, setCounties] = useState<CountyAPI[]>(INITIAL_COUNTIES);
  const [logs, setLogs] = useState<APILog[]>(INITIAL_LOGS);
  const [chartData, setChartData] = useState<PerformanceMetric[]>(HISTORICAL_CHART_DATA);

  // Add newly created county mapping from form
  const handleAddCounty = (newCounty: CountyAPI) => {
    setCounties((prev) => [newCounty, ...prev]);

    // Create log
    const addLog: APILog = {
      id: `sys-log-add-${Date.now()}`,
      countyName: newCounty.name,
      state: newCounty.state,
      timestamp: new Date().toISOString(),
      status: '200 OK',
      latency: newCounty.latencyMs,
      endpoint: newCounty.endpointUrl,
      type: 'Manual Sandbox Call',
    };

    setLogs((prev) => [addLog, ...prev]);

    // Increment historical chart total for today slightly to show impact
    setChartData((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          ...updated[lastIdx],
          totalCalls: updated[lastIdx].totalCalls + 4825, // Add daily estimate for this API
          successfulCalls: updated[lastIdx].successfulCalls + 4825,
        };
      }
      return updated;
    });
  };

  // Toggle API status (Simulator action)
  const handleToggleStatus = (id: string) => {
    setCounties((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatusMap: Record<'active' | 'pending' | 'failed', 'active' | 'pending' | 'failed'> = {
            active: 'failed',
            failed: 'pending',
            pending: 'active',
          };
          const nextStatus = nextStatusMap[c.apiStatus];
          
          let alertMsg = `Simulating connection status shift for ${c.name}: ${c.apiStatus.toUpperCase()} -> ${nextStatus.toUpperCase()}`;
          let statusText: APILog['status'] = '200 OK';
          if (nextStatus === 'failed') {
            statusText = '503 Service Unavailable';
          } else if (nextStatus === 'pending') {
            statusText = '401 Unauthorized';
          }

          // Create notification log item
          const statusLog: APILog = {
            id: `sys-log-toggle-${Date.now()}`,
            countyName: c.name,
            state: c.state,
            timestamp: new Date().toISOString(),
            status: statusText,
            latency: nextStatus === 'failed' ? 1500 : (nextStatus === 'pending' ? 0 : 120),
            endpoint: c.endpointUrl,
            type: 'Automatic Cron',
          };

          setLogs((logsPrev) => [statusLog, ...logsPrev]);

          return {
            ...c,
            apiStatus: nextStatus,
            lastSynced: nextStatus === 'active' ? new Date().toISOString() : c.lastSynced,
            latencyMs: nextStatus === 'active' ? 120 : (nextStatus === 'failed' ? 1500 : 0),
          };
        }
        return c;
      })
    );
  };

  // Automatically focus/select a county in the sandbox section
  const [sandboxFocusId, setSandboxFocusId] = useState<string>('');

  const handleSelectSandboxFocus = (id: string) => {
    setSandboxFocusId(id);
    // Scroll sandbox into view smoothly
    const sandboxEl = document.getElementById('sandbox-card');
    if (sandboxEl) {
      sandboxEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-16 flex flex-col antialiased relative overflow-x-hidden">
      {/* Background Mesh Gradients / Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[55%] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[10%] w-[45%] h-[45%] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[5%] w-[50%] h-[50%] bg-emerald-600/8 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Dynamic Header */}
      <header className="bg-slate-950/45 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-40 shadow-xl relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              <Network size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  County API Mapper
                </h1>
                <span className="bg-white/10 text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/5">
                  MVP Live Demo
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-County API Integration and Demographics Data Mapping Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-semibold shadow-inner">
              <ShieldCheck size={14} className="text-emerald-400" />
              API Gatekeeper Secure (TLS 1.3)
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8 w-full flex-1 relative z-10">
        {/* Dynamic Concept Explanation banner matching the developer's conversation Strategy */}
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 text-slate-100 rounded-2xl p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none transform translate-x-24 -skew-x-12 bg-gradient-to-r from-transparent to-indigo-400 w-3/4" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-indigo-300 font-bold font-mono text-[9px] uppercase px-2.5 py-1 rounded-md tracking-wider border border-white/5">
                <Sparkles size={11} className="text-indigo-300 animate-pulse" />
                Integration Architecture Blueprint
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                MVP Scaling Strategy Demo
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Addressing 3,000+ US counties natively requires starting with a robust, modular, and dynamic API mapper. This sandbox represents the **MVP scope**: we start small, build generic mapping templates (supporting flexible parameters like budget and permits), establish telemetry tracking curves, and allow custom endpoints to be registered gradually as budget permits.
              </p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 max-w-sm shrink-0 flex items-start gap-2.5 text-xs backdrop-blur-lg">
              <Info className="text-indigo-400 mt-0.5 shrink-0" size={16} />
              <div>
                <span className="font-bold text-white block">County Mapping Rules</span>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                  Click <b>Sandbox</b> on any county in the established integration table below to automatically pre-select it inside the Live Handshake Terminal for testing.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Aggregate KPI counts block */}
        <section id="metrics">
          <MetricCards counties={counties} />
        </section>

        {/* Live Simulator block + Live stream log block */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7">
            <APIQuerySandbox 
              counties={counties} 
              onAddLog={(newLog) => setLogs((prev) => [newLog, ...prev])}
            />
          </div>
          <div className="lg:col-span-5">
            <APILogTicker 
              logs={logs} 
              onClearLogs={handleClearLogs}
            />
          </div>
        </section>

        {/* Established county list + Gradually add form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8">
            <APIMappingList
              counties={counties}
              onToggleStatus={handleToggleStatus}
              onSelectSandbox={handleSelectSandboxFocus}
            />
          </div>
          <div className="lg:col-span-4">
            <APIMappingForm onAddCounty={handleAddCounty} />
          </div>
        </section>

        {/* Telemetry trends chart block */}
        <section>
          <APICharts chartData={chartData} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-slate-950/40 backdrop-blur-2xl py-8 relative">
        <div className="max-w-7xl mx-auto px-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 County API Integration Mapper Inc. All rights reserved.</p>
          <div className="flex justify-center sm:justify-start gap-4 font-mono text-[10px]">
            <span>ENV: LOCAL_PREVIEW</span>
            <span>PORT: 3000</span>
            <span>VER: 1.0.4-LTS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
