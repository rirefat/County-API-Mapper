import { useState, useEffect } from 'react';
import { CountyAPI } from '../types';
import { simulateFetchingCounty } from '../utils/countyData';
import { Play, Code2, Server, Wifi, RefreshCw, Cpu, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface APIQuerySandboxProps {
  counties: CountyAPI[];
  onAddLog: (log: any) => void;
}

export default function APIQuerySandbox({ counties, onAddLog }: APIQuerySandboxProps) {
  const activeCounties = counties;
  const [selectedId, setSelectedId] = useState<string>(activeCounties[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState<{ label: string; done: boolean }[]>([]);
  const [apiResult, setApiResult] = useState<{
    rawJson: string;
    statusCode: string;
    latency: number;
    simulatedTime: string;
    countyName: string;
  } | null>(null);

  // Auto-reset selection when counties state updates
  useEffect(() => {
    if (!selectedId && activeCounties.length > 0) {
      setSelectedId(activeCounties[0].id);
    }
  }, [activeCounties, selectedId]);

  const selectedCounty = activeCounties.find((c) => c.id === selectedId);

  const handleFetchAPI = async () => {
    if (!selectedCounty) return;

    setLoading(true);
    setApiResult(null);
    setTimelineSteps([
      { label: 'DNS Lookup & IP Handshake', done: false },
      { label: `Establishing Secure TLS Tunnel (${selectedCounty.endpointUrl.split('://')[0].toUpperCase()})`, done: false },
      { label: 'Transmitting Mapping Payload Template parameters', done: false },
      { label: 'Deserializing raw data payload schema', done: false },
    ]);

    // Step-by-step loading animation simulation
    const runStep = (idx: number, delayLength: number) => {
      return new Promise<void>((res) => {
        setTimeout(() => {
          setTimelineSteps((prev) =>
            prev.map((step, i) => (i === idx ? { ...step, done: true } : step))
          );
          res();
        }, delayLength);
      });
    };

    await runStep(0, 150);
    await runStep(1, 180);
    await runStep(2, 180);

    try {
      const response = await simulateFetchingCounty(selectedCounty);
      await runStep(3, 100);

      const newLog = {
        id: `sys-log-${Date.now()}`,
        countyName: response.original.name,
        state: response.original.state,
        timestamp: new Date().toISOString(),
        status: response.statusCode,
        latency: response.latency,
        endpoint: response.original.endpointUrl,
        type: 'Manual Sandbox Call' as const,
      };

      onAddLog(newLog);
      setApiResult({
        rawJson: response.rawJson,
        statusCode: response.statusCode,
        latency: response.latency,
        simulatedTime: response.simulatedTime,
        countyName: response.original.name,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="sandbox-card" className="bg-white/5 backdrop-blur-xl border border-white/10 text-slate-100 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full relative">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-indigo-300">
          <Code2 size={20} className="stroke-indigo-300" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">County API Handshake sandbox</span>
        </div>
        <h3 className="text-xl font-bold text-white mt-1">Live Endpoint Simulator</h3>
        <p className="text-xs text-slate-300 mt-1">
          Perform a visual endpoint inquiry query to inspect the incoming payloads, statuses, and schema translations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        {/* Left Side: Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5 border-r border-white/10 lg:pr-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="county-selector-sandbox" className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                1. Select Target County Connection
              </label>
              <select
                id="county-selector-sandbox"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setApiResult(null);
                }}
                className="w-full bg-[#11192e]/80 border-2 border-white/10 text-sm text-slate-100 rounded-xl py-2.5 px-4 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                disabled={loading}
              >
                {activeCounties.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-950 text-slate-200">
                    {c.name}, {c.state} ({c.apiStatus.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {selectedCounty && (
              <div className="bg-[#11192e]/45 p-4 rounded-xl border border-white/10 backdrop-blur-md space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 block">
                  INTEGRATION SPECIFICATIONS
                </span>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">URL Resource:</span>
                    <span className="text-slate-200 truncate max-w-[160px] font-medium" title={selectedCounty.endpointUrl}>
                      {selectedCounty.endpointUrl}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sync Interval:</span>
                    <span className="text-slate-200 font-semibold">{selectedCounty.syncFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fields Mapped:</span>
                    <span className="text-slate-200 font-semibold">{selectedCounty.mappedFieldsCount} fields</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status State:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedCounty.apiStatus === 'active'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                          : selectedCounty.apiStatus === 'pending'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {selectedCounty.apiStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            id="btn-trigger-sandbox"
            disabled={loading || !selectedId}
            onClick={handleFetchAPI}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border shadow-lg transition-transform active:scale-[0.98] ${
              loading 
                ? 'bg-white/5 text-slate-500 border-white/5 cursor-not-allowed' 
                : 'bg-indigo-500 hover:bg-indigo-400 text-white border-indigo-400/20 cursor-pointer shadow-indigo-500/10'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin text-slate-400" size={16} />
                Executing Handshake...
              </>
            ) : (
              <>
                <Play fill="white" size={14} className="text-white" />
                Trigger Live County API Fetch
              </>
            )}
          </button>
        </div>

        {/* Right Side: Logs / Screen */}
        <div className="lg:col-span-7 flex flex-col justify-center min-h-[280px]">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading-sandbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 p-4 bg-[#11192e]/65 rounded-xl border border-white/10 h-full flex flex-col justify-center backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <RefreshCw className="text-indigo-300 animate-spin" size={20} />
                  <div>
                    <h5 className="text-sm font-bold text-slate-200">Querying Handshake Server...</h5>
                    <p className="text-[11px] text-slate-400 font-mono">POST /api/connector/resolve-route</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-mono">
                      {step.done ? (
                        <CheckCircle size={14} className="text-emerald-400" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 border-t-indigo-400 animate-spin" />
                      )}
                      <span className={step.done ? 'text-slate-200' : 'text-slate-500'}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {!loading && apiResult && (
              <motion.div
                key="result-sandbox"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full space-y-3"
              >
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#11192e]/80 rounded-xl border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Server size={14} className="text-indigo-300" />
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">
                      {apiResult.countyName}
                    </span>
                  </div>
                  <div className="flex gap-2 text-[10px] font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        apiResult.statusCode.startsWith('200')
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      STATUS: {apiResult.statusCode}
                    </span>
                    <span className="px-2 py-0.5 bg-white/10 text-slate-200 border border-white/5 rounded font-bold">
                      LATENCY: {apiResult.latency}ms
                    </span>
                  </div>
                </div>

                {/* Raw Code output block */}
                <div className="relative flex-1 bg-slate-950/90 p-4 rounded-xl border border-white/10 font-mono text-[11px] overflow-auto max-h-72">
                  <span className="absolute top-2.5 right-3 text-[9px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    <Wifi size={10} className="text-emerald-400" />
                    Live JSON Payload
                  </span>
                  <pre className="text-emerald-400 select-all overflow-x-auto pt-4 leading-relaxed">
                    {apiResult.rawJson}
                  </pre>
                </div>
              </motion.div>
            )}

            {!loading && !apiResult && (
              <motion.div
                key="empty-sandbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 bg-[#11192e]/10 border border-dashed border-white/10 rounded-xl text-center h-full space-y-3"
              >
                <div className="p-3.5 bg-white/5 border border-white/15 rounded-2xl text-indigo-300">
                  <Cpu size={32} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Terminal Awaiting Pulse</h4>
                  <p className="text-xs text-slate-400 max-w-[280px] mx-auto mt-1">
                    Select any configured county on the left pane and call the live dynamic endpoint mappings.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
