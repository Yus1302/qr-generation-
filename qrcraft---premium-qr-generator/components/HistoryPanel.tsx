
import React from 'react';
import { History, Trash2, ArrowUpRight, Zap } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (value: string) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <History className="w-5 h-5" />
          <h2 className="text-lg font-semibold">History</h2>
        </div>
        <button 
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.value)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 transition-all text-left group"
          >
            <div className="truncate flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate flex-1">{item.value}</p>
                {item.scanCount > 0 && (
                  <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 fill-current" /> {item.scanCount}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 flex-shrink-0 ml-2 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
