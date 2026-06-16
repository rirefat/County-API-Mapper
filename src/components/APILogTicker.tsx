import { APILog } from '../types';
import { Terminal, Activity, ArrowRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface APILogTickerProps {
  logs: APILog[];
  onClearLogs: () => void;
}

export default function APILogTicker({ logs, onClearLogs }: APILogTickerProps) {
  return (
    <div id="live-logs-card" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full text-slate-200">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
            <Terminal className="text-emerald-400" size={16} />
            Live Sync Stream Logs
          </h3>
          <p className="text-[11px] text-slate-400 text-left mt-0.5">
            Incoming telemetry logs from automated cron pings & active testing
          </p>
        </div>

        <button
          id="btn-clear-logs"
          onClick={onClearLogs}
          className="text-[10px] font-mono font-bold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
        >
          Flush logs
        </button>
      </div>

      {/* Logs Feed Container */}
      <div 
        id="logs-ticker-viewport" 
        className="flex-1 bg-slate-950/60 rounded-xl border border-white/10 p-3.5 h-64 overflow-y-auto font-mono text-[11px] space-y-2.5 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => {
            const isManual = log.type === 'Manual Sandbox Call';
            const isSuccess = log.status.startsWith('200');
            return (
              <motion.div
                id={`ticker-log-item-${log.id}`}
                key={log.id}
                initial={{ opacity: 0, x: -10, y: -5 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
                  isManual 
                    ? 'bg-indigo-500/10 border-indigo-500/20' 
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isManual ? 'bg-indigo-500 text-white' : 'bg-white/15 text-slate-300'
                    }`}>
                      {log.type === 'Manual Sandbox Call' ? 'SANDBOX' : 'CRON'}
                    </span>
                    <span className="font-bold text-slate-100">
                      {log.countyName}, {log.state}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-sm sm:max-w-md md:max-w-xs" title={log.endpoint}>
                    {log.endpoint}
                  </p>
                </div>

                {/* status metrics */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-slate-400 text-[10px] font-semibold">
                    {log.latency}ms
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSuccess 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' 
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                  }`}>
                    {log.status.split(' ')[0]}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-3.5 flex items-center gap-2 px-2.5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[11px] font-mono text-indigo-300">
        <Activity size={12} className="animate-pulse text-indigo-400 shrink-0" />
        <span className="truncate font-medium">
          Listening to secure webhook deliveries at gateway applet.
        </span>
      </div>
    </div>
  );
}
