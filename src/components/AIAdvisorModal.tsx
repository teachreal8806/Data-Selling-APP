import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Shield,
  Cpu,
  ArrowRight,
  Bot
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const AIAdvisorModal: React.FC = () => {
  const { user, economy, telemetry, showAIModal, setShowAIModal, toggleDataSharing, notifyToast } = useData();
  const [analyzing, setAnalyzing] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true);

  if (!showAIModal) return null;

  const isVIP = user.tier === 'vip';

  const runReOptimization = () => {
    setAnalyzing(true);
    notifyToast('Lumina AI evaluating edge telemetry nodes...', 'info');
    setTimeout(() => {
      setAnalyzing(false);
      setReportGenerated(true);
      notifyToast('AI Bandwidth Strategy Updated!', 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#0C0C0E] p-6 border border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Lumina AI Bandwidth Strategist
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Gemini Flash
                </span>
              </h3>
              <p className="text-xs text-white/50 font-mono">
                Real-time algorithmic optimization for maximum INR yield
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAIModal(false)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4 my-4">
          {/* Key Metric Insight */}
          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-cyan-500/20 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono mb-2">
              <Sparkles className="w-4 h-4" />
              <span>DYNAMIC RECOMMENDATION REPORT</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              Based on your current ISP connection (<strong className="text-white">{telemetry.ispName}</strong>) and low edge latency of <strong className="text-cyan-300">{telemetry.latencyMs}ms</strong>, your node is graded as an <strong className="text-[#00FF87]">A+ Relay</strong>.
            </p>
          </div>

          {/* Strategic Insights Cards */}
          <div className="space-y-2.5 text-xs font-mono">
            {/* Peak Hour Forecast */}
            <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Peak Earning Window: 19:00 - 23:30 IST</div>
                <p className="text-[11px] text-white/40 mt-0.5">
                  Content delivery networks experience 300% surge in localized mesh requests. Keep data sharing active during evening hours for 1.5x throughput.
                </p>
              </div>
            </div>

            {/* Quick Sell vs Stream Analysis */}
            <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-[#00FF87] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Optimal Strategy: Hybrid Monetization</div>
                <p className="text-[11px] text-white/40 mt-0.5">
                  Combine <strong>Continuous Background Sharing</strong> with the <strong>1.0 GB Prime Quick Sell (+12% bonus)</strong> once per day to maximize weekly wallet returns.
                </p>
              </div>
            </div>

            {/* VIP Multiplier status */}
            <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 flex items-start gap-3">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">VIP Yield Multiplier: {isVIP ? 'Activated (1.15x)' : 'Not Active (1.0x)'}</div>
                <p className="text-[11px] text-white/40 mt-0.5">
                  {isVIP
                    ? 'Your node already receives priority packet bandwidth and instant UPI settlements.'
                    : 'Activating VIP for ₹99 will increase your revenue per gigabyte from ₹52 to ₹59.80 permanently.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-white/10">
          <button
            onClick={runReOptimization}
            disabled={analyzing}
            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 font-mono text-xs font-bold transition-all"
          >
            {analyzing ? 'Refreshing AI Telemetry...' : 'Refresh AI Diagnostics'}
          </button>
          
          <button
            onClick={() => {
              if (!user.isSharing) toggleDataSharing();
              setShowAIModal(false);
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-[#0A0A0C] font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,255,135,0.3)] transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{user.isSharing ? 'Keep Sharing Active' : 'Start AI-Optimized Sharing'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
