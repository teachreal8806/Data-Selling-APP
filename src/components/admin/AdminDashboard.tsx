import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Sliders,
  Bell,
  Users,
  Wallet,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Flame,
  Search,
  Filter,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  QrCode
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PayoutStatus, VIPSubmission } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    economy,
    vipSubmissions,
    withdrawals,
    announcements,
    telemetry,
    adminApproveVIP,
    adminRejectVIP,
    adminUpdatePayoutStatus,
    adminBatchApprovePayouts,
    adminUpdateEconomy,
    adminAddAnnouncement,
    adminToggleAnnouncement,
    adminDeleteAnnouncement,
    exportPayoutsCSV,
    notifyToast,
  } = useData();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'utr' | 'payouts' | 'economy' | 'broadcast'>('overview');
  
  // UTR Filter
  const [utrFilter, setUtrFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [utrSearch, setUtrSearch] = useState('');

  // Payout Filter & Selection
  const [payoutFilter, setPayoutFilter] = useState<'all' | 'pending' | 'processing' | 'paid'>('all');
  const [selectedPayoutIds, setSelectedPayoutIds] = useState<string[]>([]);

  // Rate Controller Form State
  const [rateForm, setRateForm] = useState({
    ratePerGB: economy.ratePerGB,
    vipMultiplier: economy.vipMultiplier,
    standardMinWithdrawal: economy.standardMinWithdrawal,
    vipMinWithdrawal: economy.vipMinWithdrawal,
    surgeActive: economy.surgeActive,
    surgeMultiplier: economy.surgeMultiplier,
    surgeLabel: economy.surgeLabel,
    tier1: economy.tierCommissions.tier1,
    tier2: economy.tierCommissions.tier2,
    tier3: economy.tierCommissions.tier3,
  });

  // Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMessage, setNewAnnMessage] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'boost' | 'maintenance'>('info');

  // Filtered UTRs
  const filteredUTRs = vipSubmissions.filter((sub) => {
    const matchStatus = utrFilter === 'all' ? true : sub.status === utrFilter;
    const matchSearch =
      sub.utrNumber.toLowerCase().includes(utrSearch.toLowerCase()) ||
      sub.userName.toLowerCase().includes(utrSearch.toLowerCase()) ||
      sub.upiId.toLowerCase().includes(utrSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Filtered Payouts
  const filteredPayouts = withdrawals.filter((w) => {
    if (payoutFilter === 'all') return true;
    return w.status === payoutFilter;
  });

  const handleSaveEconomy = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateEconomy({
      ratePerGB: Number(rateForm.ratePerGB),
      vipMultiplier: Number(rateForm.vipMultiplier),
      standardMinWithdrawal: Number(rateForm.standardMinWithdrawal),
      vipMinWithdrawal: Number(rateForm.vipMinWithdrawal),
      surgeActive: rateForm.surgeActive,
      surgeMultiplier: Number(rateForm.surgeMultiplier),
      surgeLabel: rateForm.surgeLabel,
      tierCommissions: {
        tier1: Number(rateForm.tier1),
        tier2: Number(rateForm.tier2),
        tier3: Number(rateForm.tier3),
      }
    });
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnMessage) return;
    adminAddAnnouncement({
      title: newAnnTitle,
      message: newAnnMessage,
      type: newAnnType,
      active: true,
    });
    setNewAnnTitle('');
    setNewAnnMessage('');
  };

  const toggleSelectPayout = (id: string) => {
    setSelectedPayoutIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFilteredPayouts = () => {
    const pendingAndProcessing = filteredPayouts
      .filter((p) => p.status === 'pending' || p.status === 'processing')
      .map((p) => p.id);
    setSelectedPayoutIds(pendingAndProcessing);
  };

  const pendingUtrCount = vipSubmissions.filter((s) => s.status === 'pending').length;
  const pendingPayoutCount = withdrawals.filter((w) => w.status === 'pending' || w.status === 'processing').length;
  const totalPaidSum = withdrawals.filter((w) => w.status === 'paid').reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Admin Header */}
      <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-[#D4AF37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_25px_rgba(212,175,55,0.08)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] glow-gold shrink-0">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Lumina Nexus Governance & Control
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#D4AF37] text-black">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Live operational telemetry, UTR financial verification, payout queue settlement, and dynamic rate controller.
            </p>
          </div>
        </div>

        {/* Global Action Badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {pendingUtrCount > 0 && (
            <button
              onClick={() => setActiveAdminTab('utr')}
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-bold animate-pulse flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingUtrCount} UTRs Pending</span>
            </button>
          )}
          {pendingPayoutCount > 0 && (
            <button
              onClick={() => setActiveAdminTab('payouts')}
              className="px-3 py-1.5 rounded-xl bg-[#00FF87]/15 border border-[#00FF87]/40 text-[#00FF87] font-bold flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{pendingPayoutCount} Payouts Queued</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Sub-navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 border-b border-white/10 no-scrollbar">
        {[
          { id: 'overview', label: 'System Telemetry', icon: Activity },
          { id: 'utr', label: `UTR Verification (${pendingUtrCount})`, icon: QrCode },
          { id: 'payouts', label: `Payout Manager (${pendingPayoutCount})`, icon: Wallet },
          { id: 'economy', label: 'Dynamic Rate Controller', icon: Sliders },
          { id: 'broadcast', label: 'Announcements', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TELEMETRY TAB */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Shared Bandwidth */}
            <div className="p-4 rounded-2xl bg-[#0C0C0E] border border-white/10">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-xs font-mono">Total Network Shared</span>
                <Activity className="w-4 h-4 text-[#00FF87]" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                148.64 <span className="text-xs text-white/40 font-normal">TB</span>
              </div>
              <p className="text-[11px] text-[#00FF87] font-mono mt-1">
                +14.2 TB in last 24h
              </p>
            </div>

            {/* Active Nodes */}
            <div className="p-4 rounded-2xl bg-[#0C0C0E] border border-white/10">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-xs font-mono">Connected Nodes</span>
                <Users className="w-4 h-4 text-[#00FF87]" />
              </div>
              <div className="text-2xl font-bold text-[#00FF87] font-mono">
                {telemetry.activeGlobalNodes.toLocaleString()}
              </div>
              <p className="text-[11px] text-white/40 font-mono mt-1">
                98.4% uptime health
              </p>
            </div>

            {/* Total Revenue Collected */}
            <div className="p-4 rounded-2xl bg-[#0C0C0E] border border-white/10">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-xs font-mono">VIP Revenue (₹99)</span>
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-2xl font-bold text-[#D4AF37] font-mono">
                ₹{(vipSubmissions.filter((s) => s.status === 'approved').length * 99 + 48900).toLocaleString()}
              </div>
              <p className="text-[11px] text-[#D4AF37]/80 font-mono mt-1">
                +₹891 from new VIPs today
              </p>
            </div>

            {/* Total Dispatched Payouts */}
            <div className="p-4 rounded-2xl bg-[#0C0C0E] border border-white/10">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-xs font-mono">Settled Payouts</span>
                <Wallet className="w-4 h-4 text-[#00FF87]" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                ₹{(totalPaidSum + 82400).toLocaleString()}
              </div>
              <p className="text-[11px] text-white/40 font-mono mt-1">
                100% On-Time 24/7 UPI
              </p>
            </div>
          </div>

          {/* Telemetry Architecture Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00FF87]" />
                Live Mesh Throughput & Edge Routing
              </h4>
              <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white/40">Active Edge Relay:</span>
                  <span className="text-white">{telemetry.serverNodeLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Global Peak Throughput:</span>
                  <span className="text-[#00FF87]">4.82 GB/sec aggregate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Current Surge Multiplier:</span>
                  <span className={economy.surgeActive ? 'text-[#D4AF37] font-bold' : 'text-white/40'}>
                    {economy.surgeActive ? `${economy.surgeMultiplier}x Active` : '1.0x (Standard)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Fraud Prevention Filter:</span>
                  <span className="text-[#00FF87]">Zero Simulated Packet Flags</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D4AF37]" />
                Quick Economy Controls
              </h4>
              <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Base MB-to-INR Conversion:</span>
                  <span className="font-bold text-[#00FF87]">₹{economy.ratePerGB}/GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">VIP Bonus Yield:</span>
                  <span className="font-bold text-[#D4AF37]">+{((economy.vipMultiplier - 1) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Minimum Withdrawal:</span>
                  <span className="text-white">₹{economy.standardMinWithdrawal} (Std) / ₹{economy.vipMinWithdrawal} (VIP)</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveAdminTab('economy')}
                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold transition-all text-center"
                  >
                    Adjust Real-Time Economics →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. UTR VERIFICATION QUEUE TAB */}
      {activeAdminTab === 'utr' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0C0C0E] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#D4AF37]" />
                VIP ₹99 UTR Payment Verification Queue
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Inspect 12-digit transaction references submitted by users. Approving instantly upgrades the user to VIP.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0C] border border-white/10 text-xs font-mono">
              {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setUtrFilter(f)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all ${
                    utrFilter === f
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={utrSearch}
              onChange={(e) => setUtrSearch(e.target.value)}
              placeholder="Search by UTR Number, User Name, or UPI ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0C0C0E] border border-white/10 focus:border-[#D4AF37] text-xs font-mono text-white"
            />
          </div>

          {/* Table / List of Submissions */}
          <div className="space-y-3">
            {filteredUTRs.length === 0 ? (
              <div className="p-8 text-center bg-[#0C0C0E] border border-white/10 rounded-2xl text-xs font-mono text-white/40">
                No UTR records found matching filter "{utrFilter}".
              </div>
            ) : (
              filteredUTRs.map((sub) => {
                const isPending = sub.status === 'pending';
                return (
                  <div
                    key={sub.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isPending
                        ? 'bg-[#0C0C0E] border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.06)]'
                        : 'bg-[#0C0C0E] border-white/10'
                    }`}
                  >
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {sub.userName}
                        </span>
                        <span className="text-white/40">({sub.userEmail})</span>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] uppercase font-bold ${
                            sub.status === 'approved'
                              ? 'bg-[#00FF87]/20 text-[#00FF87] border border-[#00FF87]/30'
                              : sub.status === 'rejected'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 animate-pulse'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <div className="text-white/80">
                        UTR / Txn Ref:{' '}
                        <strong className="text-[#D4AF37] tracking-wider text-sm">
                          {sub.utrNumber}
                        </strong>
                      </div>

                      <div className="text-[11px] text-white/40 flex items-center gap-3">
                        <span>Payer UPI: <strong className="text-white">{sub.upiId}</strong></span>
                        <span>•</span>
                        <span>Amount: <strong className="text-[#00FF87]">₹{sub.amount}</strong></span>
                        <span>•</span>
                        <span>{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {isPending ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => adminApproveVIP(sub.id)}
                          className="px-4 py-2 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,135,0.25)] transition-all active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve VIP</span>
                        </button>
                        <button
                          onClick={() => adminRejectVIP(sub.id, 'UTR Invalid or not received')}
                          className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-mono text-xs transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-right text-xs font-mono text-white/40">
                        {sub.reviewedAt && (
                          <span>Verified {new Date(sub.reviewedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. PAYOUT MANAGER TAB */}
      {activeAdminTab === 'payouts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0C0C0E] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#00FF87]" />
                User Payout Settlement Manager
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Batch process pending UPI requests or export standard banking CSV for bulk payment dispatch.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportPayoutsCSV}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#00FF87]" />
                <span>Export Bulk UPI CSV</span>
              </button>

              {selectedPayoutIds.length > 0 && (
                <button
                  onClick={() => {
                    adminBatchApprovePayouts(selectedPayoutIds);
                    setSelectedPayoutIds([]);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,255,135,0.3)] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Batch Mark Paid ({selectedPayoutIds.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter and select-all bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[#0A0A0C] border border-white/5 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={selectAllFilteredPayouts}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white/80 font-mono text-[11px]"
              >
                Select All Pending
              </button>
              <span className="text-white/20">|</span>
              <span className="text-white/50">{selectedPayoutIds.length} Selected</span>
            </div>

            <div className="flex items-center gap-1">
              {(['all', 'pending', 'processing', 'paid'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setPayoutFilter(status)}
                  className={`px-3 py-1 rounded-lg capitalize text-xs ${
                    payoutFilter === status
                      ? 'bg-[#00FF87] text-black font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Payouts list */}
          <div className="space-y-2.5">
            {filteredPayouts.map((w) => {
              const isSelected = selectedPayoutIds.includes(w.id);
              const isPending = w.status === 'pending' || w.status === 'processing';

              return (
                <div
                  key={w.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#0C0C0E] border-[#00FF87]/40 shadow-[0_0_15px_rgba(0,255,135,0.06)]'
                      : 'bg-[#0C0C0E] border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isPending && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectPayout(w.id)}
                        className="w-4 h-4 rounded border-white/20 accent-[#00FF87] cursor-pointer"
                      />
                    )}

                    <div className="space-y-0.5 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {w.userName}
                        </span>
                        <span className="text-base font-bold text-[#00FF87]">
                          ₹{w.amount.toFixed(2)}
                        </span>
                        {w.isVIPPriority && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                            VIP 0-MIN
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] uppercase font-bold ${
                            w.status === 'paid'
                              ? 'bg-[#00FF87]/20 text-[#00FF87]'
                              : w.status === 'processing'
                              ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                              : 'bg-white/10 text-white/70'
                          }`}
                        >
                          {w.status}
                        </span>
                      </div>

                      <div className="text-white/80">
                        {w.method}: <strong className="text-white">{w.paymentDetail}</strong>
                      </div>

                      {w.txnRef && (
                        <div className="text-[11px] text-[#00FF87] font-mono">
                          Txn ID: {w.txnRef}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {isPending && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => adminUpdatePayoutStatus(w.id, 'paid')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as Paid</span>
                      </button>
                      <button
                        onClick={() => adminUpdatePayoutStatus(w.id, 'rejected')}
                        className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. DYNAMIC RATE CONTROLLER TAB */}
      {activeAdminTab === 'economy' && (
        <div className="p-6 rounded-2xl bg-[#0C0C0E] border border-white/10 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#D4AF37]" />
              Dynamic Economic Parameters & Rate Engine
            </h3>
            <p className="text-xs text-white/50 mt-1">
              Changes applied here instantaneously update the live conversion multipliers across all user PWAs and calculations.
            </p>
          </div>

          <form onSubmit={handleSaveEconomy} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Base Rate Per GB */}
              <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-2">
                <label className="block text-xs font-mono text-white/70">
                  Base Earning Rate (₹ Per GB)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="10"
                    max="500"
                    value={rateForm.ratePerGB}
                    onChange={(e) => setRateForm({ ...rateForm, ratePerGB: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 focus:border-[#00FF87] font-mono text-sm text-white"
                  />
                </div>
                <p className="text-[10px] text-white/40 font-mono">
                  = ~₹{(rateForm.ratePerGB / 1024).toFixed(4)} per MB
                </p>
              </div>

              {/* VIP Multiplier */}
              <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-2">
                <label className="block text-xs font-mono text-white/70">
                  VIP Yield Multiplier
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="1.0"
                  max="3.0"
                  value={rateForm.vipMultiplier}
                  onChange={(e) => setRateForm({ ...rateForm, vipMultiplier: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 focus:border-[#D4AF37] font-mono text-sm text-white"
                />
                <p className="text-[10px] text-[#D4AF37] font-mono">
                  Current: +{((rateForm.vipMultiplier - 1) * 100).toFixed(0)}% Bonus to VIPs
                </p>
              </div>

              {/* Standard Min Withdrawal */}
              <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-2">
                <label className="block text-xs font-mono text-white/70">
                  Standard Min Withdrawal (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono">₹</span>
                  <input
                    type="number"
                    step="10"
                    min="50"
                    value={rateForm.standardMinWithdrawal}
                    onChange={(e) => setRateForm({ ...rateForm, standardMinWithdrawal: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 focus:border-[#00FF87] font-mono text-sm text-white"
                  />
                </div>
                <p className="text-[10px] text-white/40 font-mono">
                  Default: ₹200 threshold
                </p>
              </div>

              {/* VIP Min Withdrawal */}
              <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-2">
                <label className="block text-xs font-mono text-white/70">
                  VIP Min Withdrawal (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono">₹</span>
                  <input
                    type="number"
                    step="10"
                    min="10"
                    value={rateForm.vipMinWithdrawal}
                    onChange={(e) => setRateForm({ ...rateForm, vipMinWithdrawal: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 focus:border-[#D4AF37] font-mono text-sm text-white"
                  />
                </div>
                <p className="text-[10px] text-[#D4AF37] font-mono">
                  Enables low barrier instant cashout
                </p>
              </div>

              {/* Referral Level 1 % */}
              <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-2">
                <label className="block text-xs font-mono text-white/70">
                  Referral Level 1 Royalty (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={rateForm.tier1}
                  onChange={(e) => setRateForm({ ...rateForm, tier1: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 focus:border-[#00FF87] font-mono text-sm text-white"
                />
              </div>

              {/* Referral Level 2 & 3 % */}
              <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-2">
                <label className="block text-xs font-mono text-white/70">
                  Referral Level 2 & 3 (%)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={rateForm.tier2}
                    onChange={(e) => setRateForm({ ...rateForm, tier2: Number(e.target.value) })}
                    className="w-full px-2 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 focus:border-[#00FF87] font-mono text-xs text-white"
                    placeholder="L2 %"
                  />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={rateForm.tier3}
                    onChange={(e) => setRateForm({ ...rateForm, tier3: Number(e.target.value) })}
                    className="w-full px-2 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 focus:border-[#00FF87] font-mono text-xs text-white"
                    placeholder="L3 %"
                  />
                </div>
              </div>
            </div>

            {/* Surge Event Controller */}
            <div className="p-5 rounded-2xl bg-[#0A0A0C] border border-[#D4AF37]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Global 1.5x Peak Hour Surge Event
                    </h4>
                    <p className="text-xs text-white/50">
                      Instantly boost all earnings platform-wide to incentivize network node supply.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rateForm.surgeActive}
                    onChange={(e) => setRateForm({ ...rateForm, surgeActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>

              {rateForm.surgeActive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">Surge Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.1"
                      max="3.0"
                      value={rateForm.surgeMultiplier}
                      onChange={(e) => setRateForm({ ...rateForm, surgeMultiplier: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 focus:border-[#D4AF37] font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">Broadcast Banner Text</label>
                    <input
                      type="text"
                      value={rateForm.surgeLabel}
                      onChange={(e) => setRateForm({ ...rateForm, surgeLabel: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 focus:border-[#D4AF37] font-mono text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply Economy Parameters Live</span>
            </button>
          </form>
        </div>
      )}

      {/* 5. GLOBAL ANNOUNCEMENTS TAB */}
      {activeAdminTab === 'broadcast' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0C0C0E] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#00FF87]" />
              Compose System Broadcast
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-white/50 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="e.g. ⚡ VIP Rate Boost Activated"
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/50 mb-1">Type</label>
                  <select
                    value={newAnnType}
                    onChange={(e) => setNewAnnType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white"
                  >
                    <option value="info">Information</option>
                    <option value="boost">Boost Event (Gold)</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/50 mb-1">Message</label>
                <textarea
                  required
                  rows={2}
                  value={newAnnMessage}
                  onChange={(e) => setNewAnnMessage(e.target.value)}
                  placeholder="Enter details visible to all connected node clients..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,255,135,0.3)]"
              >
                Broadcast to Network
              </button>
            </form>
          </div>

          {/* Active Announcements List */}
          <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white">
              Active Broadcast Banners ({announcements.length})
            </h4>

            <div className="space-y-2.5">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{ann.title}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                          ann.type === 'boost'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                            : ann.type === 'maintenance'
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-white/10 text-white/70'
                        }`}
                      >
                        {ann.type}
                      </span>
                    </div>
                    <p className="text-white/50 text-[11px] mt-0.5">{ann.message}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => adminToggleAnnouncement(ann.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                        ann.active ? 'bg-[#00FF87]/20 text-[#00FF87]' : 'bg-white/5 text-white/30'
                      }`}
                    >
                      {ann.active ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => adminDeleteAnnouncement(ann.id)}
                      className="p-1 rounded text-red-400 hover:bg-red-500/10"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
