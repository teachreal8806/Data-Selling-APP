import React from 'react';
import {
  Activity,
  Play,
  Pause,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Wifi,
  Clock,
  ArrowUpRight,
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { WebGLPulseShader } from './WebGLPulseShader';

export const LiveSharingController: React.FC = () => {
  const {
    user,
    economy,
    telemetry,
    historyPoints,
    toggleDataSharing,
    setActiveTab,
  } = useData();

  const isSharing = user.isSharing;
  const isVIP = user.tier === 'vip';

  // Calculate live hourly earning potential
  const currentMBps = isSharing ? telemetry.liveThroughputKBps / 1024 : 3.8;
  const hourlyMB = currentMBps * 3600;
  const ratePerMB = economy.ratePerGB / 1024;
  let estimatedHourlyINR = hourlyMB * ratePerMB * (isVIP ? economy.vipMultiplier : 1.0);
  if (economy.surgeActive) estimatedHourlyINR *= economy.surgeMultiplier;

  return (
    <div className="space-y-4">
      {/* Top Hero Card with Lumina Pulse Shader & Reactor Switch */}
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
          isVIP ? 'glass-panel-gold' : 'glass-panel'
        }`}
      >
        {/* WebGL Pulse Canvas Viewport */}
        <div className="relative">
          <WebGLPulseShader height={260} />
          
          {/* Central Reactor Button Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-center">
              <button
                onClick={toggleDataSharing}
                className={`relative group p-1 rounded-full transition-all duration-300 transform active:scale-95 ${
                  isSharing
                    ? isVIP
                      ? 'shadow-[0_0_40px_rgba(255,215,0,0.4)]'
                      : 'shadow-[0_0_40px_rgba(0,255,135,0.45)]'
                    : 'hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]'
                }`}
              >
                {/* Glow ring */}
                <div
                  className={`absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity ${
                    isSharing
                      ? isVIP
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 animate-spin-slow'
                        : 'bg-gradient-to-r from-[#00FF87] to-cyan-400 animate-spin-slow'
                      : 'bg-white/20'
                  }`}
                />

                {/* Inner button surface */}
                <div
                  className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                    isSharing
                      ? isVIP
                        ? 'bg-[#181308] border-amber-400 text-amber-300'
                        : 'bg-[#061710] border-[#00FF87] text-[#00FF87]'
                      : 'bg-[#12151F] border-white/20 text-slate-300 hover:text-white hover:border-white/40'
                  }`}
                >
                  {isSharing ? (
                    <>
                      <Pause className="w-7 h-7 mb-0.5 animate-pulse" />
                      <span className="text-[10px] font-bold tracking-wider uppercase font-mono">
                        SHARING
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-7 h-7 mb-0.5 ml-1 text-[#00FF87]" />
                      <span className="text-[10px] font-bold tracking-wider uppercase font-mono">
                        START
                      </span>
                    </>
                  )}
                </div>
              </button>
              
              <div className="mt-2.5 px-3 py-1 rounded-full bg-[#0A0A0C]/90 border border-white/10 backdrop-blur-md">
                <span className="text-xs font-mono font-medium text-slate-300">
                  {isSharing ? 'Node Broadcasting Packets' : 'Click to Monetize Bandwidth'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="p-4 bg-[#0A0A0C] border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Live Speed */}
          <div className="p-3.5 rounded-xl bg-[#0C0C0E] border border-white/5">
            <div className="flex items-center justify-between text-white/40 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Speed
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 font-mono">Live</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {isSharing ? (telemetry.liveThroughputKBps / 1024).toFixed(2) : '0.00'}{' '}
              <span className="text-xs text-white/40 font-normal">MB/s</span>
            </div>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">
              {isSharing ? `${telemetry.latencyMs}ms Latency` : 'Idle'}
            </p>
          </div>

          {/* Session Data */}
          <div className="p-3.5 rounded-xl bg-[#0C0C0E] border border-white/5">
            <div className="flex items-center justify-between text-white/40 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Session
              </span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {user.sessionDataSharedMB.toFixed(1)}{' '}
              <span className="text-xs text-white/40 font-normal">MB</span>
            </div>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">
              Total: {(user.totalDataSharedMB / 1024).toFixed(2)} GB
            </p>
          </div>

          {/* Hourly Yield */}
          <div className="p-3.5 rounded-xl bg-[#0C0C0E] border border-white/5">
            <div className="flex items-center justify-between text-white/40 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#00FF87]" /> Yield Rate
              </span>
              {isVIP && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono font-bold">
                  +15%
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-[#00FF87] font-mono">
              ~₹{estimatedHourlyINR.toFixed(2)}{' '}
              <span className="text-xs text-white/40 font-normal">/hr</span>
            </div>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">
              ₹{(economy.ratePerGB).toFixed(0)}/GB Base
            </p>
          </div>

          {/* Node Security */}
          <div className="p-3.5 rounded-xl bg-[#0C0C0E] border border-white/5">
            <div className="flex items-center justify-between text-white/40 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00FF87]" /> Tunnel
              </span>
            </div>
            <div className="text-sm font-bold text-white font-mono truncate">
              AES-256 P2P
            </div>
            <p className="text-[10px] text-[#00FF87] font-mono mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-ping" /> Verified Safe
            </p>
          </div>
        </div>
      </div>

      {/* VIP Status Banner or Callout */}
      {!isVIP ? (
        <div className="p-4 rounded-2xl bg-[#0C0C0E] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_20px_rgba(212,175,55,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm tracking-tight">
                  Unlock VIP Priority Node (₹99 One-Time)
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-[#D4AF37] text-black">
                  Instant UPI
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Earn <strong className="text-[#D4AF37]">+15% yield bonus</strong>, 24/7 instant UPI withdrawals, and priority mesh allocation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('vip')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-bold text-xs font-mono flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-95 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade for ₹99</span>
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-[#0C0C0E] border border-[#D4AF37]/30 flex items-center justify-between shadow-[0_0_15px_rgba(212,175,55,0.05)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-mono text-[#D4AF37] font-bold">
              👑 VIP PRIME NODE ACTIVATED
            </span>
            <span className="text-[11px] text-white/40 font-mono hidden md:inline">
              | 15% Bonus Applied | 0-Min UPI Queue
            </span>
          </div>
          <button
            onClick={() => setActiveTab('payouts')}
            className="text-xs font-mono text-[#D4AF37] hover:underline font-medium"
          >
            Instant Cashout →
          </button>
        </div>
      )}

      {/* Real-time Bandwidth Telemetry Graph */}
      <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00FF87]" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Live Network Telemetry
            </h4>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-white/40 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF87]" /> Throughput
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> INR Index
            </span>
          </div>
        </div>

        {/* Minimalist SVG Bar/Line graph */}
        <div className="h-28 w-full flex items-end gap-2 pt-4 px-3 bg-[#0A0A0C] rounded-xl border border-white/5 overflow-x-auto">
          {historyPoints.map((pt, idx) => {
            const heightPercent = Math.min(100, Math.max(15, (pt.mbps / 7.0) * 100));
            return (
              <div key={idx} className="flex-1 min-w-[28px] flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="text-[9px] font-mono text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  {pt.mbps}M
                </div>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#00FF87]/20 via-[#00FF87]/60 to-[#00FF87] group-hover:to-cyan-300 transition-all duration-300 relative"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                </div>
                <span className="text-[8px] font-mono text-white/40">{pt.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
