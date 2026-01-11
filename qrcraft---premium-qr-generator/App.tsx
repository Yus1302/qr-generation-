
import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Type, 
  Link, 
  Mail, 
  Phone, 
  Download, 
  Copy, 
  Check, 
  RefreshCw,
  Settings,
  X,
  Plus,
  QrCode,
  Activity
} from 'lucide-react';
import { InputType, QRConfig, HistoryItem, ScanEvent } from './types';
import { validateInput, getPlaceholder } from './utils/validators';
import Header from './components/Header';
import HistoryPanel from './components/HistoryPanel';
import AnalyticsSection from './components/AnalyticsSection';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [inputType, setInputType] = useState<InputType>(InputType.URL);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState('');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  
  const [config, setConfig] = useState<QRConfig>({
    value: '',
    size: 512,
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: 'H',
    includeMargin: true,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('qrcraft_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedTheme = localStorage.getItem('qrcraft_theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('qrcraft_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const validation = validateInput(val, inputType);
    setError(val ? validation.message : '');
  };

  const generateQR = () => {
    const validation = validateInput(inputValue, inputType);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setConfig(prev => ({ ...prev, value: inputValue }));
      setShowQR(true);
      setIsGenerating(false);
      
      const existingItem = history.find(h => h.value === inputValue);
      let updatedHistory: HistoryItem[];
      let activeId: string;

      if (existingItem) {
        activeId = existingItem.id;
        updatedHistory = [
          { ...existingItem, timestamp: Date.now() },
          ...history.filter(h => h.id !== existingItem.id)
        ];
      } else {
        activeId = crypto.randomUUID();
        const newItem: HistoryItem = {
          id: activeId,
          value: inputValue,
          timestamp: Date.now(),
          type: inputType,
          scanCount: 0,
          events: []
        };
        updatedHistory = [newItem, ...history].slice(0, 15);
      }
      
      setHistory(updatedHistory);
      setSelectedHistoryId(activeId);
      localStorage.setItem('qrcraft_history', JSON.stringify(updatedHistory));
    }, 600);
  };

  const handleSimulateScan = (id: string, customDevice?: 'Mobile' | 'Desktop' | 'Tablet') => {
    const locations = ['San Francisco, US', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'Paris, FR', 'Sydney, AU', 'Toronto, CA', 'Mumbai, IN', 'Singapore, SG', 'Dubai, AE'];
    const devices: Array<'Mobile' | 'Desktop' | 'Tablet'> = ['Mobile', 'Mobile', 'Mobile', 'Desktop', 'Tablet'];
    
    const newEvent: ScanEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      device: customDevice || devices[Math.floor(Math.random() * devices.length)],
      location: locations[Math.floor(Math.random() * locations.length)]
    };

    const updatedHistory = history.map(item => {
      if (item.id === id) {
        return {
          ...item,
          scanCount: item.scanCount + 1,
          lastScannedAt: Date.now(),
          events: [...item.events, newEvent]
        };
      }
      return item;
    });

    setHistory(updatedHistory);
    localStorage.setItem('qrcraft_history', JSON.stringify(updatedHistory));
  };

  const handleDownload = (format: 'png' | 'jpg') => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `qrcraft-${Date.now()}.${format}`;
    link.href = canvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`);
    link.click();
  };

  const copyToClipboard = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    } catch (err) { console.error(err); }
  };

  const reset = () => {
    setInputValue('');
    setShowQR(false);
    setError('');
    setSelectedHistoryId(null);
    setConfig(prev => ({ ...prev, value: '' }));
  };

  const selectedItem = history.find(h => h.id === selectedHistoryId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500 selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card rounded-3xl p-8 shadow-2xl dark:shadow-none border border-white/20">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                  Generate & Track
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Create high-fidelity QR codes and track scan data via the dashboard below.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: InputType.URL, icon: Link, label: 'URL' },
                  { id: InputType.TEXT, icon: Type, label: 'Text' },
                  { id: InputType.EMAIL, icon: Mail, label: 'Email' },
                  { id: InputType.PHONE, icon: Phone, label: 'Phone' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setInputType(item.id);
                      setInputValue('');
                      setError('');
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      inputType === item.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && generateQR()}
                    placeholder={getPlaceholder(inputType)}
                    className={`w-full px-6 py-5 rounded-2xl border-2 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none transition-all ${
                      error 
                        ? 'border-red-300 dark:border-red-900/50 focus:border-red-500' 
                        : 'border-slate-100 dark:border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {inputValue && (
                    <button onClick={reset} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {error && <p className="text-sm text-red-500 ml-2 animate-in slide-in-from-top-1">{error}</p>}

                <button
                  onClick={generateQR}
                  disabled={!inputValue || !!error || isGenerating}
                  className="w-full py-4 bg-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  {isGenerating ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Generate QR Code</>}
                </button>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200">
                  <Settings className="w-5 h-5" />
                  <h3 className="font-semibold">Customization</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">QR Color</label>
                    <div className="flex items-center gap-4">
                      <input type="color" value={config.fgColor} onChange={(e) => setConfig({ ...config, fgColor: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer bg-transparent" />
                      <span className="text-sm font-mono uppercase text-slate-500">{config.fgColor}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Background Color</label>
                    <div className="flex items-center gap-4">
                      <input type="color" value={config.bgColor} onChange={(e) => setConfig({ ...config, bgColor: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer bg-transparent" />
                      <span className="text-sm font-mono uppercase text-slate-500">{config.bgColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedItem && (
              <div className="glass-card rounded-3xl p-8 shadow-xl border border-white/20 transition-all">
                <AnalyticsSection item={selectedItem} onSimulateScan={handleSimulateScan} />
              </div>
            )}
          </div>

          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className={`glass-card rounded-3xl p-8 shadow-2xl dark:shadow-none transition-all duration-700 ${showQR ? 'scale-100 opacity-100' : 'scale-95 opacity-80 blur-sm pointer-events-none'}`}>
              <div className="flex flex-col items-center gap-8">
                <div className="relative p-6 bg-white rounded-2xl shadow-inner border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                  
                  {selectedItem && selectedItem.scanCount > 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 animate-bounce">
                      <Activity className="w-3 h-3" />
                      {selectedItem.scanCount} Scans
                    </div>
                  )}

                  <div ref={canvasRef} className="overflow-hidden rounded-lg">
                    {config.value ? (
                      <QRCodeCanvas value={config.value} size={256} level={config.level} fgColor={config.fgColor} bgColor={config.bgColor} includeMargin={config.includeMargin} />
                    ) : (
                      <div className="w-64 h-64 bg-slate-50 dark:bg-slate-900 rounded-lg flex flex-col items-center justify-center text-slate-300 gap-4">
                         <QrCode className="w-16 h-16 opacity-20" />
                         <span className="text-xs font-medium uppercase tracking-widest opacity-40">Awaiting Input</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleDownload('png')} className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95"><Download className="w-4 h-4" /> PNG</button>
                    <button onClick={() => handleDownload('jpg')} className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"><Download className="w-4 h-4" /> JPG</button>
                  </div>
                  <button onClick={copyToClipboard} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95">
                    {copySuccess ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Image</>}
                  </button>
                </div>
              </div>
            </div>

            <HistoryPanel 
              history={history} 
              onSelect={(val) => {
                const item = history.find(h => h.value === val);
                if (item) {
                  setInputValue(val);
                  setConfig(prev => ({ ...prev, value: val }));
                  setShowQR(true);
                  setSelectedHistoryId(item.id);
                }
              }}
              onClear={() => {
                setHistory([]);
                setSelectedHistoryId(null);
                localStorage.removeItem('qrcraft_history');
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
