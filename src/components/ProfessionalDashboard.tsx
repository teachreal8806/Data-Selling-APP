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
  Globe,
  Radio,
  History,
  ArrowRight
} from 'lucide-react';
import { useData, QUICK_SELL_PACKAGES } from '../context/DataContext';
import { WebGLPulseShader } from './WebGLPulseShader';
import { QuickSellPackage } from '../types';

export const ProfessionalDashboard: React.FC = () => {
  const {
    user,
    economy,
    telemetry,
    transactions,
    toggleDataSharing,
    quickSell,
    setActiveTab,
    triggerAIAdvisor,
    notifyToast,
    exportPayoutsCSV,
  } = useData();

  const isSharing = user.isSharing;
  const isVIP = user.tier === 'vip';

  // Calculator State
  const [calcGB, setCalcGB] = useState<number>(3);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [sellingId, setSellingId] = useState<string | null>(null);

  // Rate Calculations
  const effectiveRatePerGB = isVIP
    ? economy.ratePerGB * economy.vipMultiplier
    : economy.ratePerGB;

  const dailyProj = Number((calcGB * effectiveRatePerGB).toFixed(2));
  const weeklyProj = Number((dailyProj * 7).toFixed(2));
  const monthlyProj = Number((dailyProj * 30).toFixed(2));

  // Current session & throughput
  const currentMBps = isSharing ? (telemetry.liveThroughputKBps / 1024).toFixed(2) : '0.00';
  const minThreshold = isVIP ? economy.vipMinWithdrawal : economy.standardMinWithdrawal;
  const progressPercent = Math.min(100, Math.round((user.balanceINR / minThreshold) * 100));

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    notifyToast('Referral code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleQuickSell = (pkg: QuickSellPackage) => {
    setSellingId(pkg.id);
    setTimeout(() => {
      quickSell(pkg);
      setSellingId(null);
    }, 350);
  };

  // Recent transactions list
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 3. DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Welcome back, {user.name}!
            </h1>
            {isVIP && (
              <span className="flex items-center gap-1 text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                <Crown className="w-3 h-3" /> VIP PRO
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-white/50 mt-0.5 font-sans">
            Start sharing your bandwidth and earn instantly.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerAIAdvisor}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 via-[#00FF87]/15 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-[#00FF87]/30 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,255,135,0.15)] transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#00FF87] animate-pulse" />
            <span>AI Optimizer</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN NODE / BANDWIDTH CARD */}
      <div
        className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
          isVIP
            ? 'bg-[#0C101D] border-[#D4AF37]/40 shadow-[0_0_30px_rgba(212,175,55,0.06)]'
            : 'bg-[#0C101D] border-white/10 shadow-[0_0_30px_rgba(0,255,135,0.05)]'
        }`}
      >
        {/* Top Accent Gradient Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] ${
            isVIP
              ? 'bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#00FF87] to-transparent'
          }`}
        />

        {/* Node Status Bar Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span
                className={`w-3 h-3 rounded-full ${
                  isSharing ? 'bg-[#00FF87] animate-ping opacity-75' : 'bg-white/20'
                }`}
              />
              <span
                className={`absolute w-2 h-2 rounded-full ${
                  isSharing ? 'bg-[#00FF87]' : 'bg-white/40'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  NODE STATUS: {isSharing ? 'ONLINE • STREAMING' : 'IDLE • READY'}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSharing
                      ? 'bg-[#00FF87]/20 text-[#00FF87] border border-[#00FF87]/40'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {isSharing ? 'P2P ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/50 mt-0.5">
                {telemetry.serverNodeLocation} • {telemetry.ispName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-white/60">
            <span className="hidden sm:inline">IP:</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-white/80">
              {telemetry.assignedIP}
            </span>
          </div>
        </div>

        {/* Center: WebGL Pulse Canvas & Large Circular START Button */}
        <div className="relative p-8 sm:p-12 flex flex-col items-center justify-center min-h-[260px]">
          <WebGLPulseShader height={240} />

          {/* Center Button Action Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-center">
              <button
                onClick={toggleDataSharing}
                className={`relative group p-2 rounded-full transition-all duration-300 transform active:scale-95 ${
                  isSharing
                    ? isVIP
                      ? 'shadow-[0_0_60px_rgba(212,175,55,0.4)]'
                      : 'shadow-[0_0_60px_rgba(0,255,135,0.45)]'
                    : 'hover:shadow-[0_0_35px_rgba(0,255,135,0.25)]'
                }`}
              >
                {/* Glow ring */}
                <div
                  className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
                    isSharing
                      ? isVIP
                        ? 'bg-gradient-to-r from-[#D4AF37] to-amber-300 opacity-80 animate-spin-slow'
                        : 'bg-gradient-to-r from-[#00FF87] to-cyan-400 opacity-80 animate-spin-slow'
                      : 'bg-white/10 group-hover:bg-[#00FF87]/30'
                  }`}
                />

                {/* Big Button Circle */}
                <div
                  className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                    isSharing
                      ? isVIP
                        ? 'bg-[#141006] border-[#D4AF37] text-[#D4AF37]'
                        : 'bg-[#061710] border-[#00FF87] text-[#00FF87]'
                      : 'bg-[#0B0F19] border-white/20 text-white/80 hover:border-[#00FF87] hover:text-[#00FF87]'
                  }`}
                >
                  {isSharing ? (
                    <>
                      <Pause className="w-9 h-9 mb-1 animate-pulse" />
                      <span className="text-[11px] font-bold font-mono tracking-wider uppercase">
                        SELLING
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-9 h-9 mb-1 ml-1 text-[#00FF87]" />
                      <span className="text-[11px] font-bold font-mono tracking-wider uppercase">
                        START
                      </span>
                    </>
                  )}
                </div>
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs font-mono font-semibold text-white">
                  {isSharing ? 'Tap to pause sharing' : 'Tap to monetize unused data'}
                </p>
                <p className="text-[11px] font-mono text-white/40 mt-0.5">
                  {isSharing
                    ? 'Actively streaming data packets to edge relays'
                    : 'Your device is ready to start earning'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Bottom Live Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-4 sm:p-5 bg-[#090D18] border-t border-white/5 text-center">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
              Live Throughput
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#00FF87] mt-0.5 block">
              {currentMBps} MB/s
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
              Rate / GB
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-white mt-0.5 block">
              ₹{effectiveRatePerGB.toFixed(2)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
              Session Sold
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-white mt-0.5 block">
              {user.sessionDataSharedMB.toFixed(1)} MB
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
              Network Latency
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-cyan-400 mt-0.5 block">
              {telemetry.latencyMs} ms
            </span>
          </div>
        </div>
      </div>

      {/* 5. BALANCE + VIP SECTION (Side-by-Side Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* BALANCE CARD */}
        <div className="p-6 rounded-3xl bg-[#0C101D] border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center gap-1.5 font-bold">
                <Wallet className="w-4 h-4 text-[#00FF87]" /> Available Balance
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30">
                INR Live Account
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                ₹{user.balanceINR.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-white/40">
                (Lifetime: ₹{user.lifetimeEarningsINR.toFixed(2)})
              </span>
            </div>

            {/* Threshold Progress Bar */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">
                  Withdrawal Goal (₹{minThreshold} Min)
                </span>
                <span className="font-bold text-white">
                  {progressPercent}% Ready
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#090D18] p-0.5 border border-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isVIP
                      ? 'bg-gradient-to-r from-[#D4AF37] to-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                      : 'bg-gradient-to-r from-[#00FF87] to-cyan-400 shadow-[0_0_12px_rgba(0,255,135,0.4)]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => setActiveTab('wallet')}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,135,0.25)] transition-all active:scale-95"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Withdraw via UPI</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-mono text-xs font-semibold border border-white/10 transition-all"
            >
              Payout Records
            </button>
          </div>
        </div>

        {/* VIP CARD */}
        <div className="p-6 rounded-3xl bg-[#0C101D] border border-[#D4AF37]/35 relative overflow-hidden flex flex-col justify-between shadow-[0_0_25px_rgba(212,175,55,0.06)]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Crown className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  {isVIP ? 'VIP Payout Tier Active' : 'VIP Payout Tier'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                {isVIP ? 'PRO NODE' : `₹${economy.vipActivationFee} ONE-TIME`}
              </span>
            </div>

            {/* VIP Benefits list */}
            <div className="space-y-2 text-xs font-sans text-white/80 mt-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>0-minute automated UPI settlements 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Reduced minimum withdrawal: <strong className="text-white">₹50</strong> (vs ₹200)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span><strong className="text-[#D4AF37]">+15% rate multiplier</strong> on all bandwidth shared</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            {isVIP ? (
              <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center font-mono text-xs text-[#D4AF37] font-bold flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                <span>VIP Priority Status Activated</span>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('vip')}
                className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all active:scale-95"
              >
                <span>Upgrade to VIP (₹{economy.vipActivationFee})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. QUICK SELL GRID */}
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0C101D] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00FF87]" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Instant Quick Sell Grid
              </h3>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Monetize chunked data packets instantly without waiting. Credits applied directly to your wallet balance.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D18] border border-white/10 font-mono text-xs text-white/80">
            <span className="text-white/40">Current Rate:</span>
            <span className="text-[#00FF87] font-bold">₹{economy.ratePerGB}/GB</span>
            {isVIP && <span className="text-[#D4AF37] font-bold">(+15% VIP)</span>}
          </div>
        </div>

        {/* 6 Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_SELL_PACKAGES.map((pkg) => {
            let estimatedEarnings = pkg.baseReward * (1 + pkg.bonusRate);
            if (isVIP) estimatedEarnings *= economy.vipMultiplier;
            if (economy.surgeActive) estimatedEarnings *= economy.surgeMultiplier;
            estimatedEarnings = Number(estimatedEarnings.toFixed(2));

            const isSelling = sellingId === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  pkg.popular
                    ? 'bg-[#0C101D] border-[#00FF87]/50 shadow-[0_0_25px_rgba(0,255,135,0.1)] ring-1 ring-[#00FF87]/30'
                    : 'bg-[#0C101D] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00FF87] text-[#0A0A0C] shadow-sm">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                {!pkg.popular && pkg.tag && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white/70">
                      {pkg.tag}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        pkg.popular
                          ? 'bg-[#00FF87]/15 text-[#00FF87]'
                          : 'bg-white/5 text-white/70'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base tracking-tight">
                        {pkg.label}
                      </h4>
                      <span className="text-[11px] font-mono text-white/40">
                        {pkg.mbAmount >= 1024
                          ? `${(pkg.mbAmount / 1024).toFixed(1)} GB Packet`
                          : `${pkg.mbAmount} MB Packet`}
                      </span>
                    </div>
                  </div>

                  <div className="my-4 p-3.5 rounded-xl bg-[#090D18] border border-white/5 flex items-baseline justify-between">
                    <span className="text-xs text-white/40 font-mono">Instant Payout:</span>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-[#00FF87] font-mono">
                        ₹{estimatedEarnings.toFixed(2)}
                      </span>
                      {pkg.bonusRate > 0 && (
                        <span className="block text-[10px] text-cyan-300 font-mono">
                          Includes +{(pkg.bonusRate * 100).toFixed(0)}% bonus
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sell Button */}
                <button
                  onClick={() => handleQuickSell(pkg)}
                  disabled={isSelling}
                  className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                    pkg.popular
                      ? 'bg-[#00FF87] text-[#0A0A0C] hover:bg-[#20ff97] shadow-[0_0_15px_rgba(0,255,135,0.3)]'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  {isSelling ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Processing Mesh...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>
                        Sell {pkg.mbAmount >= 1024 ? `${pkg.mbAmount / 1024} GB` : `${pkg.mbAmount} MB`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. RECENT SETTLEMENTS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0C101D] border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00FF87]" />
            <h3 className="text-sm font-bold text-white tracking-tight font-mono uppercase">
              Recent Settlements & Activity
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-mono text-[#00FF87] hover:underline flex items-center gap-1"
          >
            <span>View Full Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-xs font-mono">
            No activity yet. Start sharing bandwidth or sell data packets to earn!
          </div>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((tx) => {
              const isNegative = tx.type === 'withdrawal';
              const dateFormatted = new Date(tx.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-[#090D18] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      {tx.type === 'quick_sell' ? (
                        <Zap className="w-4 h-4 text-[#00FF87]" />
                      ) : tx.type === 'withdrawal' ? (
                        <Wallet className="w-4 h-4 text-amber-400" />
                      ) : tx.type === 'referral_bonus' ? (
                        <Users className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#00FF87]" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{tx.description}</div>
                      <div className="text-[10px] text-white/40 font-mono">
                        {dateFormatted} • Status: {tx.status}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div
                      className={`text-sm font-bold ${
                        isNegative ? 'text-amber-400' : 'text-[#00FF87]'
                      }`}
                    >
                      {isNegative ? '-' : '+'}₹{tx.amountINR.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-white/40 block">
                      {isNegative ? 'Bank Payout' : 'Wallet Credited'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 8. BANDWIDTH MONETIZATION CALCULATOR */}
      <div className="p-6 rounded-3xl bg-[#0C101D] border border-white/10">
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

        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-mono text-white/70 mb-2">
              <span>Daily Shared Data:</span>
              <span className="font-bold text-white text-sm">{calcGB} GB / Day</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={calcGB}
              onChange={(e) => setCalcGB(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-[#090D18] rounded-lg appearance-none cursor-pointer accent-[#00FF87] border border-white/10"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
              <span>500 MB</span>
              <span>5 GB</span>
              <span>10 GB</span>
              <span>20 GB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#090D18] border border-white/5 text-center">
              <span className="text-[10px] font-mono text-white/50 uppercase block">Daily Yield</span>
              <span className="text-xl font-bold font-mono text-[#00FF87] mt-1 block">
                ₹{dailyProj.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#090D18] border border-white/5 text-center">
              <span className="text-[10px] font-mono text-white/50 uppercase block">Weekly Yield</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                ₹{weeklyProj.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#090D18] border border-[#D4AF37]/20 text-center bg-gradient-to-br from-[#090D18] to-[#161208]">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase block font-bold">
                Monthly Passive Income
              </span>
              <span className="text-2xl font-extrabold font-mono text-[#D4AF37] mt-1 block">
                ₹{monthlyProj.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
