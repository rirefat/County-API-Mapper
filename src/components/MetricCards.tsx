import { CountyAPI } from '../types';
import { Database, Link2, Percent, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardsProps {
  counties: CountyAPI[];
}

export default function MetricCards({ counties }: MetricCardsProps) {
  const totalMapped = 3143; // Standard total US counties
  const activeIntegrationsCount = counties.filter((c) => c.apiStatus === 'active').length;
  const pendingIntegrationsCount = counties.filter((c) => c.apiStatus === 'pending').length;
  const failedIntegrationsCount = counties.filter((c) => c.apiStatus === 'failed').length;
  const totalTracked = counties.length;

  const successRate = totalTracked > 0 
    ? ((counties.filter(c => c.apiStatus === 'active').length / (counties.filter(c => c.apiStatus !== 'pending').length || 1)) * 100).toFixed(1)
    : "0";

  const totalDailyVolume = activeIntegrationsCount * 4825; // 4825 estimated daily calls per active API

  const cards = [
    {
      id: 'metric-mapped',
      title: 'US Counties Mapped',
      value: `${totalTracked} / ${totalMapped.toLocaleString()}`,
      subtext: `Dashboard tracking ${parseFloat(((totalTracked / totalMapped) * 100).toFixed(2))}% of total US`,
      icon: Database,
      color: 'border-emerald-500/20 text-emerald-300',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    },
    {
      id: 'metric-active',
      title: 'Active API Connectors',
      value: activeIntegrationsCount,
      subtext: `${pendingIntegrationsCount} pending integration, ${failedIntegrationsCount} failed connection`,
      icon: Link2,
      color: 'border-indigo-500/20 text-indigo-300',
      iconBg: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25',
    },
    {
      id: 'metric-success',
      title: 'Sync Success Rate',
      value: `${successRate}%`,
      subtext: 'Calculated over established non-draft connections',
      icon: Percent,
      color: 'border-teal-500/20 text-teal-300',
      iconBg: 'bg-teal-500/15 text-teal-400 border border-teal-500/25',
    },
    {
      id: 'metric-volume',
      title: 'Aggregated Est. Daily Volume',
      value: totalDailyVolume.toLocaleString(),
      subtext: 'Simulated total active continuous API inquiries',
      icon: Activity,
      color: 'border-violet-500/20 text-violet-300',
      iconBg: 'bg-violet-500/15 text-violet-400 border border-violet-500/25',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            id={card.id}
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  {card.title}
                </span>
                <span className="text-3xl font-bold text-white tracking-tight block">
                  {card.value}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl ${card.iconBg} shrink-0`}>
                <Icon size={20} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="text-xs font-medium text-slate-400">
                {card.subtext}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
