
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Zap, Smartphone, Monitor, CheckCircle2 } from 'lucide-react';
import { HistoryItem } from '../types';

interface AnalyticsSectionProps {
  item: HistoryItem;
  onSimulateScan: (id: string) => void;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ item, onSimulateScan }) => {
  const [pulse, setPulse] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (item.scanCount > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [item.scanCount]);

  const handleSimulate = () => {
    onSimulateScan(item.id);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const deviceStats = item.events.reduce((acc, event) => {
    acc[event.device] = (acc[event.device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = item.events.length || 1;
  const mobilePct = Math.round(((deviceStats['Mobile'] || 0) / total) * 100);
  const desktopPct = Math.round(((deviceStats['Desktop'] || 0) / total) * 100);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <BarChart3 className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm">Scan Insights</h3>
        </div>
        <button 
          onClick={handleSimulate}
          className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            showSuccess 
              ? 'bg-green-500 text-white' 
              : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200'
          }`}
        >
          {showSuccess ? (
            <><CheckCircle2 className="w-3 h-3" /> SCANNED!</>
          ) : (
            'SIMULATE SCAN'
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`bg-white dark:bg-slate-800/50 p-4 rounded-2xl border transition-all duration-300 ${
          pulse ? 'border-indigo-500 scale-105 shadow-lg dark:shadow-indigo-900/20' : 'border-slate-100 dark:border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Zap className={`w-3.5 h-3.5 transition-colors ${pulse ? 'text-indigo-500' : ''}`} />
            <span className="text-[10px] font-bold uppercase">Total Scans</span>
          </div>
          <div className={`text-2xl font-black transition-all ${pulse ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
            {item.scanCount}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase">Unique</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {Math.ceil(item.scanCount * 0.85)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <span>Device Distribution</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> {mobilePct}%</span>
            <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> {desktopPct}%</span>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div style={{ width: `${mobilePct}%` }} className="h-full bg-indigo-500 transition-all duration-1000" />
          <div style={{ width: `${desktopPct}%` }} className="h-full bg-slate-300 dark:bg-slate-600 transition-all duration-1000" />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Recent Activity</span>
        <div className="space-y-3">
          {item.events.length > 0 ? (
            item.events.slice(-3).reverse().map(event => (
              <div key={event.id} className="flex items-center justify-between text-[11px] animate-in slide-in-from-left-2 duration-300">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  {event.device === 'Mobile' ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                  <span className="font-medium">{event.location}</span>
                </div>
                <span className="text-slate-400 font-mono">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-400 text-xs italic">
              No scan activity recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
