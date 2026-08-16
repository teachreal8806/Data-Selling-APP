import React, { useState } from 'react';
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
  Award,
  Wallet,
  ArrowDownToLine,
  Crown,
  Users,
  Copy,
  CheckCircle2,
  Sliders,
  DollarSign,
  ChevronRight,
  Layers,
  Globe
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { WebGLPulseShader } from './WebGLPulseShader';
import { QuickSellGrid } from './QuickSellGrid';

export const ProfessionalDashboard: React.FC = () => {
  const {
    user,
    economy,
    telemetry,
    transactions,
    toggleDataSharing,
    setActiveTab,
    triggerAIAdvisor,
    notifyToast,
    setAuthModalOpen,
    setAuthModalTab,
    isAuthenticated,
  } = useData();

  const isSharing = user.isSharing;
  const isVIP = user.tier === 'vip';

  // Calculator State
  const [calcGB, setCalcGB] = useState<number>(3);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Rate Calculations
  const effectiveRatePerGB = isVIP
    ? economy.ratePerGB * economy.vipMultiplier
    : economy.ratePerGB;
  
  const dailyProj = Number((calcGB * effectiveRatePerGB).toFixed(2));
  const weeklyProj = Number((dailyProj * 7).toFixed(2));
  const monthlyProj = Number((dailyProj * 30).toFixed(2));

  // Current session & throughput
  const currentMBps = isSharing ? telemetry.liveThroughputKBps / 1024 : 0;
  const minWd = isVIP ? economy.vipMinWithdrawal : economy.standardMinWithdrawal;
  const progressPercent = Math.min(100, Math.round((user.balanceINR / minWd) * 100));

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    notifyToast('Referral code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* 1. TOP LIVE MONETIZATION COMMAND CENTER */}
      <div
        className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
          isVIP ? 'border-[#D4AF37]/40 bg-[#0C0C0E]' : 'border-white/10 bg-[#0C0C0E]'
        }`}
      >
        {/* Glow Header Accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] ${
            isVIP
              ? 'bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#00FF87] to-transparent'
          }`}
        />

        {/* Top Status Bar */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span
                className={`w-3 h-3 rounded-full ${
                  isSharing ? 'bg-[#00FF87] animate-ping opacity-75' : 'bg-white/30'
                }`}
              />
              <span
                className={`absolute w-2.5 h-2.5 rounded-full ${
                  isSharing ? 'bg-[#00FF87]' : 'bg-white/40'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {isSharing ? 'Node Active • Data Monetization Stream' : 'Node Standby • Idle'}
                </span>
                {isVIP && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37] text-black">
                    VIP 1.15x
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-white/50">
                {telemetry.serverNodeLocation} • {telemetry.ispName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerAIAdvisor}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00FF87]" />
              <span className="hidden sm:inline">AI Optimizer</span>
            </button>
            {!isVIP && (
              <button
                onClick={() => setActiveTab('vip')}
                className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Upgrade VIP</span>
              </button>
            )}
          </div>
        </div>

        {/* Central Reactor & Live Speed Stream */}
        <div className="relative p-6 sm:p-8 flex flex-col items-center justify-center">
          <WebGLPulseShader height={200} />

          {/* Central Reactor Switch */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-center">
              <button
                onClick={toggleDataSharing}
                className={`relative group p-1.5 rounded-full transition-all duration-300 transform active:scale-95 ${
                  isSharing
                    ? isVIP
                      ? 'shadow-[0_0_50px_rgba(212,175,55,0.4)]'
                      : 'shadow-[0_0_50px_rgba(0,255,135,0.45)]'
                    : 'hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity ${
                    isSharing
                      ? isVIP
                        ? 'bg-gradient-to-r from-[#D4AF37] to-amber-300 animate-spin-slow'
                        : 'bg-gradient-to-r from-[#00FF87] to-cyan-400 animate-spin-slow'
                      : 'bg-white/20'
                  }`}
                />

                <div
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                    isSharing
                      ? isVIP
                        ? 'bg-[#141006] border-[#D4AF37] text-[#D4AF37]'
                        : 'bg-[#061710] border-[#00FF87] text-[#00FF87]'
                      : 'bg-[#101014] border-white/20 text-white/70 hover:text-white hover:border-white/40'
                  }`}
                >
                  {isSharing ? (
                    <>
                      <Pause className="w-8 h-8 mb-1 animate-pulse" />
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase">
                        SELLING
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-8 h-8 mb-1 ml-1 text-[#00FF87]" />
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase">
                        START
                      </span>
                    </>
                  )}
                </div>
              </button>

              <div className="mt-3 text-center">
                <span className="text-xs font-mono text-white/60">
                  {isSharing ? 'Tap to pause sharing' : 'Tap to monetize unused data'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-[#0A0A0C] border-t border-white/5 text-center">
          <div className="p-2.5 rounded-xl bg-white/[0.02]">
            <span className="text-[10px] font-mono text-white/50 uppercase block">Live Throughput</span>
            <span className="text-sm sm:text-base font-bold font-mono text-[#00FF87]">
              {isSharing ? `${(telemetry.liveThroughputKBps / 1024).toFixed(2)} MB/s` : '0.00 MB/s'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02]">
            <span className="text-[10px] font-mono text-white/50 uppercase block">Rate / GB</span>
            <span className="text-sm sm:text-base font-bold font-mono text-white">
              ₹{effectiveRatePerGB.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02]">
            <span className="text-[10px] font-mono text-white/50 uppercase block">Session Sold</span>
            <span className="text-sm sm:text-base font-bold font-mono text-white">
              {(user.sessionDataSharedMB).toFixed(1)} MB
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02]">
            <span className="text-[10px] font-mono text-white/50 uppercase block">Network Latency</span>
            <span className="text-sm sm:text-base font-bold font-mono text-cyan-400">
              {telemetry.latencyMs} ms
            </span>
          </div>
        </div>
      </div>

      {/* 2. WALLET BALANCE & WITHDRAWAL STATUS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Balance Card */}
        <div className="md:col-span-2 p-5 sm:p-6 rounded-3xl bg-[#0C0C0E] border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-[#00FF87]" /> Available Balance
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#00FF87]/10 text-[#00FF87] border border-[#00FF87]/30">
                INR Live Account
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-white">
                ₹{user.balanceINR.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-white/50">
                (Lifetime: ₹{user.lifetimeEarningsINR.toFixed(2)})
              </span>
            </div>
          </div>

          {/* Progress Bar to Threshold */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-white/60">
              <span>Withdrawal Threshold (₹{minWd})</span>
              <span className="font-bold text-white">{progressPercent}% Ready</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isVIP
                    ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                    : 'bg-gradient-to-r from-[#00FF87] to-cyan-400 shadow-[0_0_10px_rgba(0,255,135,0.5)]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('wallet')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,135,0.25)] transition-all"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Withdraw via UPI</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-mono text-xs transition-all"
            >
              Payout Records
            </button>
          </div>
        </div>

        {/* VIP Status & Fast Payout Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0C0C0E] border border-[#D4AF37]/30 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Crown className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                {isVIP ? 'VIP Activated' : 'VIP Payout Tier'}
              </span>
            </div>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              {isVIP
                ? 'Your node enjoys 0-minute instant UPI settlements and +15% bonus yield.'
                : 'Unlock instant 24/7 UPI payouts & ₹50 minimum withdrawal threshold.'}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            {isVIP ? (
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center font-mono text-xs text-[#D4AF37] font-bold">
                ✓ Priority Instant Settlement Active
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('vip')}
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
              >
                <span>Activate VIP (₹{economy.vipActivationFee})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. QUICK 1-TAP BANDWIDTH SELLING LEDGER */}
      <QuickSellGrid />

      {/* 4. EARNINGS CALCULATOR & ESTIMATION ENGINE */}
      <div className="p-6 rounded-3xl bg-[#0C0C0E] border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00FF87]" />
              Bandwidth Monetization Calculator
            </h3>
            <p className="text-xs text-white/50 font-mono">
              Estimate your monthly passive income based on shared gigabytes
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#00FF87] px-2.5 py-1 rounded-xl bg-[#00FF87]/10 border border-[#00FF87]/30">
            ₹{effectiveRatePerGB.toFixed(2)} / GB Rate
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono text-white/70 mb-2">
              <span>Daily Shared Data:</span>
              <span className="font-bold text-white">{calcGB} GB / Day</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={calcGB}
              onChange={(e) => setCalcGB(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FF87]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
              <span>500 MB</span>
              <span>5 GB</span>
              <span>10 GB</span>
              <span>20 GB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0A0A0C] border border-white/5 text-center">
              <span className="text-[10px] font-mono text-white/50 uppercase block">Daily Yield</span>
              <span className="text-lg font-bold font-mono text-[#00FF87] mt-1 block">
                ₹{dailyProj.toFixed(2)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0A0C] border border-white/5 text-center">
              <span className="text-[10px] font-mono text-white/50 uppercase block">Weekly Yield</span>
              <span className="text-lg font-bold font-mono text-white mt-1 block">
                ₹{weeklyProj.toFixed(2)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0A0C] border border-white/5 text-center">
              <span className="text-[10px] font-mono text-white/50 uppercase block">Monthly Income</span>
              <span className="text-xl font-bold font-mono text-[#D4AF37] mt-1 block">
                ₹{monthlyProj.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 3-TIER REFERRAL PROGRAM TEASER */}
      <div className="p-6 rounded-3xl bg-[#0C0C0E] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Users className="w-4 h-4 text-[#00FF87]" />
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              3-Tier Node Referral Program
            </h4>
          </div>
          <p className="text-xs text-white/60 max-w-md">
            Earn lifetime passive income on 3 downline tiers: <span className="text-white font-bold">15% Level 1</span>, <span className="text-white font-bold">7% Level 2</span>, and <span className="text-white font-bold">3% Level 3</span> from every MB your invited nodes monetize.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="px-4 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 font-mono text-sm font-bold text-[#00FF87]">
            {user.referralCode}
          </div>
          <button
            onClick={handleCopyCode}
            className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className="py-2.5 px-4 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono text-xs font-bold transition-all"
          >
            Network View
          </button>
        </div>
      </div>
    </div>
  );
};
