import { useState, FormEvent } from 'react';
import { CountyAPI } from '../types';
import { getMappableFieldsTemplate } from '../utils/countyData';
import { PlusCircle, Info, Check, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface APIMappingFormProps {
  onAddCounty: (county: CountyAPI) => void;
}

export default function APIMappingForm({ onAddCounty }: APIMappingFormProps) {
  const [name, setName] = useState('');
  const [state, setState] = useState('CA');
  const [population, setPopulation] = useState('500000');
  const [endpoint, setEndpoint] = useState('');
  const [frequency, setFrequency] = useState('Hourly');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'budget_allocated',
    'active_building_permits',
  ]);
  const [successMsg, setSuccessMsg] = useState(false);

  const fieldsTemplate = getMappableFieldsTemplate();

  const handleFieldToggle = (key: string) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !endpoint) return;

    // Compile new County API model
    const newCounty: CountyAPI = {
      id: `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      name: name.trim().endsWith('County') ? name.trim() : `${name.trim()} County`,
      state,
      population: parseInt(population) || 250000,
      apiStatus: 'active', // starts active
      endpointUrl: endpoint.startsWith('http') ? endpoint : `https://${endpoint}`,
      lastSynced: new Date().toISOString(),
      syncFrequency: frequency,
      mappedFieldsCount: selectedFields.length,
      latencyMs: Math.floor(Math.random() * 150) + 90,
      data: {
        budgetAllocated: selectedFields.includes('budget_allocated') ? Math.floor(Math.random() * 4000000000) + 100000000 : 0,
        activePermits: selectedFields.includes('active_building_permits') ? Math.floor(Math.random() * 8000) + 1200 : 0,
        transitFactor: selectedFields.includes('public_transit_factor') ? parseFloat((Math.random() * 6 + 3).toFixed(1)) : 0,
        healthScore: selectedFields.includes('healthcare_safety_score') ? Math.floor(Math.random() * 30) + 65 : 0,
        crimeRateIndex: selectedFields.includes('safety_index') ? Math.floor(Math.random() * 40) + 40 : 0,
      },
    };

    onAddCounty(newCounty);
    setSuccessMsg(true);

    // Reset Form
    setName('');
    setEndpoint('');
    setSelectedFields(['budget_allocated', 'active_building_permits']);

    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  return (
    <div id="add-connector-card" className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-6 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <PlusCircle className="text-indigo-400" size={20} />
          Gradual Scale-Up
        </h3>
        <p className="text-xs text-slate-350 mt-1">
          Dynamically scale your system by configuring new server mapping templates.
        </p>

        {successMsg && (
          <motion.div
            id="form-success-info"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex items-start gap-2"
          >
            <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-emerald-200">Integration Connection mapped!</span>
              <p className="text-[11px] text-emerald-300/90 mt-0.5">
                The county endpoint is active, registered in the regional synchronization scheduler, and accessible in the Live Sandbox space.
              </p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label htmlFor="input-county-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                County name (e.g., Orange)
              </label>
              <input
                id="input-county-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Orange"
                className="w-full border border-white/10 text-slate-100 bg-[#11192e]/60 rounded-xl text-xs px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-slate-500 shadow-inner"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="input-county-state" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                US State
              </label>
              <select
                id="input-county-state"
                value={state}
                aria-label="Select state"
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-white/10 text-slate-100 bg-[#11192e]/60 rounded-xl text-xs px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
              >
                {['CA', 'TX', 'NY', 'FL', 'IL', 'AZ', 'GA', 'MI', 'WA', 'NC', 'OH'].map((st) => (
                  <option key={st} value={st} className="bg-slate-950 text-slate-200">
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Population */}
            <div>
              <label htmlFor="input-county-pop" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Estimated population
              </label>
              <input
                id="input-county-pop"
                type="number"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                placeholder="pop"
                className="w-full border border-white/10 text-slate-100 bg-[#11192e]/60 rounded-xl text-xs px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-slate-500 shadow-inner"
              />
            </div>

            {/* Sync Frequency */}
            <div>
              <label htmlFor="input-county-frequency" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Scheduler Frequency
              </label>
              <select
                id="input-county-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full border border-white/10 text-slate-100 bg-[#11192e]/60 rounded-xl text-xs px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
              >
                <option value="Hourly" className="bg-slate-950 text-slate-200">Hourly Ping</option>
                <option value="Daily" className="bg-slate-950 text-slate-200">Daily Sync</option>
                <option value="Weekly" className="bg-slate-950 text-slate-200">Weekly Backup</option>
              </select>
            </div>
          </div>

          {/* Endpoint */}
          <div>
            <label htmlFor="input-county-url" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              External JSON Resource Endpoint URL
            </label>
            <input
              id="input-county-url"
              type="text"
              required
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="e.g. api.orangecounty.gov/v1/metrics"
              className="w-full border border-white/10 text-slate-100 bg-[#11192e]/60 rounded-xl text-xs px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono placeholder-slate-500 shadow-inner"
            />
          </div>

          {/* Mapping Checklist */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              2. Schema Data Mappings Parameters ({selectedFields.length} active)
            </span>
            <div id="fields-checklist" className="space-y-1.5 p-3 bg-slate-950/40 border border-white/10 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
              {fieldsTemplate.map((field) => {
                const isSelected = selectedFields.includes(field.key);
                return (
                  <button
                    key={field.key}
                    type="button"
                    onClick={() => handleFieldToggle(field.key)}
                    className="flex items-start gap-2.5 w-full text-left p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500 text-white' 
                          : 'border-white/25 bg-white/5'
                      }`}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold block text-slate-200">
                        {field.key} <span className="text-slate-400 font-normal">({field.type})</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">
                        {field.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <button
          id="btn-submit-connector"
          onClick={handleSubmit}
          disabled={!name || !endpoint}
          className={`w-full py-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all border shadow-lg ${
            !name || !endpoint
              ? 'bg-white/5 text-slate-500 border-white/5 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-400 border-indigo-400/20 text-white cursor-pointer shadow-indigo-500/10'
          }`}
        >
          Add Mapped Connection Endpoint
        </button>
      </div>
    </div>
  );
}
