import { useState } from 'react';
import { CountyAPI } from '../types';
import { Search, Filter, RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface APIMappingListProps {
  counties: CountyAPI[];
  onToggleStatus: (id: string) => void;
  onSelectSandbox: (id: string) => void;
}

export default function APIMappingList({ counties, onToggleStatus, onSelectSandbox }: APIMappingListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'failed'>('all');

  // Filter list
  const filteredCounties = counties.filter((county) => {
    const matchesSearch =
      county.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      county.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || county.apiStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="mapping-list-card" className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-6 relative">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Established Integrations</h3>
          <p className="text-xs text-slate-300 mt-1">
            Configure mapped routes, toggle connection statuses, and request raw JSON payloads.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              id="search-county"
              type="text"
              placeholder="Search county or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-white/10 text-slate-100 bg-[#11192e]/60 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-[#11192e]/85 transition-all w-48 sm:w-60 placeholder-slate-500 shadow-inner"
            />
          </div>

          {/* Status Filter */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
            {(['all', 'active', 'pending', 'failed'] as const).map((status) => (
              <button
                id={`filter-${status}`}
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white/15 text-white border border-white/5 shadow-inner'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid List Table */}
      <div className="overflow-x-auto">
        <table id="counties-table" className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-4">County / State</th>
              <th className="pb-3">Endpoint Url</th>
              <th className="pb-3">Sync Interval</th>
              <th className="pb-3 text-center">Status state</th>
              <th className="pb-3 text-right pr-4">Interactive Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredCounties.length > 0 ? (
                filteredCounties.map((county, idx) => (
                  <motion.tr
                    id={`county-row-${county.id}`}
                    key={county.id}
                    layoutId={`row-${county.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="group hover:bg-white/5 transition-colors text-xs"
                  >
                    {/* County / State Panel */}
                    <td className="py-4 pl-4">
                      <div>
                        <span className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {county.name}
                        </span>
                        <span className="ml-1.5 bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase border border-white/5">
                          {county.state}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Pop. {county.population.toLocaleString()} • {county.mappedFieldsCount} fields mapped
                      </div>
                    </td>

                    {/* Endpoint */}
                    <td className="py-4 max-w-[200px]">
                      <div className="font-mono text-[11px] text-slate-400 truncate group-hover:text-slate-200 transition-colors" title={county.endpointUrl}>
                        {county.endpointUrl}
                      </div>
                      {county.lastSynced && (
                        <div className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                          <Clock size={10} className="text-slate-500" />
                          Last synced: {county.lastSynced.includes('T') ? new Date(county.lastSynced).toLocaleTimeString() : county.lastSynced}
                        </div>
                      )}
                    </td>

                    {/* Frequency */}
                    <td className="py-4">
                      <span className="font-mono text-slate-300 font-medium">
                        {county.syncFrequency}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        {county.apiStatus === 'active' && <CheckCircle2 size={13} className="text-emerald-400" />}
                        {county.apiStatus === 'pending' && <Clock size={13} className="text-amber-400" />}
                        {county.apiStatus === 'failed' && <AlertCircle size={13} className="text-rose-400" />}
                        <span
                          className={`font-semibold uppercase text-[10px] ${
                            county.apiStatus === 'active'
                              ? 'text-emerald-400'
                              : county.apiStatus === 'pending'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {county.apiStatus}
                        </span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status Simulation */}
                        <button
                          id={`btn-toggle-status-${county.id}`}
                          onClick={() => onToggleStatus(county.id)}
                          title="Simulate route outage status toggle"
                          className="p-1.5 bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                        >
                          <RefreshCw size={12} />
                        </button>

                        {/* select in sandbox */}
                        <button
                          id={`btn-select-sandbox-${county.id}`}
                          onClick={() => onSelectSandbox(county.id)}
                          className="px-2.5 py-1.5 bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer"
                        >
                          Sandbox
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <p className="font-mono text-xs">No established integrations match current filters.</p>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
