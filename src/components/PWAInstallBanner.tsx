import React, { useState } from 'react';
import { Smartphone, Download, Check, X, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';

export const PWAInstallBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const { notifyToast } = useData();

  if (dismissed) return null;

  const handleInstall = () => {
    setInstalled(true);
    notifyToast('DataRefine PWA saved to Home Screen! Background sharing enabled.', 'success');
    setTimeout(() => setDismissed(true), 1500);
  };

  return (
    <div className="p-3.5 rounded-2xl bg-[#0C0C0E] border border-white/10 flex items-center justify-between gap-3 text-xs shadow-lg animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#00FF87]/15 border border-[#00FF87]/30 flex items-center justify-center text-[#00FF87] shrink-0">
          <Smartphone className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>Install DataRefine PWA App</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00FF87]/20 text-[#00FF87] font-mono">
              V2.4
            </span>
          </div>
          <p className="text-[11px] text-white/40 font-mono">
            Enable 24/7 background bandwidth mining even when your browser tab is closed.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstall}
          disabled={installed}
          className="px-3.5 py-1.5 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-[#0A0A0C] font-mono font-bold text-xs flex items-center gap-1 shadow-[0_0_15px_rgba(0,255,135,0.3)] transition-all active:scale-95"
        >
          {installed ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Installed</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </>
          )}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-white/40 hover:text-white transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
