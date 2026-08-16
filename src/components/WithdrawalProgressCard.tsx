import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Building2,
  Sparkles,
  ShieldCheck,
  Crown,
  ChevronRight,
  Receipt,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { PayoutMethod } from '../types';

export const WithdrawalProgressCard: React.FC = () => {
  const {
    user,
    economy,
    paymentConfig,
    requestWithdrawal,
    withdrawals,
    setActiveTab,
    setSelectedWithdrawalDetail
  } = useData();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<PayoutMethod>('UPI');
  const [paymentDetail, setPaymentDetail] = useState<string>(user.upiId || '');
  const [bankIfsc, setBankIfsc] = useState<string>('');

  const isVIP = user.tier === 'vip';
  const isActivationPaid = Boolean(user.hasPaidActivation || user.vipStatus === 'active' || user.tier === 'vip');
  const requiresPayment = Boolean(paymentConfig.requirePaymentBeforeWithdrawal && !isActivationPaid);

  const minThreshold = isVIP ? economy.vipMinWithdrawal : economy.standardMinWithdrawal;
  const balance = user.balanceINR;
  const progressPercent = Math.min(100, Math.max(0, (balance / minThreshold) * 100));
  const remaining = Math.max(0, minThreshold - balance);
  const canWithdraw = balance >= minThreshold;

  const handleOpenWithdrawModal = () => {
    if (requiresPayment) {
      setActiveTab('vip');
      return;
    }
    setAmount(balance.toFixed(0));
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) return;

    let finalDetail = paymentDetail;
    if (method === 'BANK_TRANSFER') {
      finalDetail = `A/C: ${paymentDetail}, IFSC: ${bankIfsc.toUpperCase()}`;
    }

    const res = requestWithdrawal(withdrawAmount, method, finalDetail);
    if (res.success) {
      setShowModal(false);
      setAmount('');
    } else if (res.requirePayment) {
      setShowModal(false);
      setActiveTab('vip');
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Before Withdrawal Alert Gate Banner (if not yet paid) */}
      {requiresPayment && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_25px_rgba(212,175,55,0.1)]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Node Authentication Payment Required
                </h4>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  ₹{paymentConfig.activationFee} Security Deposit
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1 max-w-xl">
                {paymentConfig.activationNote || 'As per anti-bot mesh protocol, complete a one-time verification payment before releasing withdrawals to your UPI/Bank.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('vip')}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all active:scale-95"
          >
            <Crown className="w-4 h-4" />
            <span>Pay & Activate (₹{paymentConfig.activationFee})</span>
          </button>
        </div>
      )}

      {/* Main Persistent Meter Card */}
      <div
        className={`p-5 rounded-2xl border transition-all duration-300 ${
          isVIP ? 'bg-[#0C0C0E] border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.08)]' : 'bg-[#0C0C0E] border-white/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isVIP
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                  : 'bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30'
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Withdrawal Threshold Meter
                </h3>
                {isVIP ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                    VIP Instant ₹{economy.vipMinWithdrawal}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-white/10 text-white/70">
                    Standard ₹{economy.standardMinWithdrawal}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                {isVIP
                  ? 'VIP priority status: 0-minute automated UPI settlements 24/7.'
                  : `Reach ₹${economy.standardMinWithdrawal} to request payout or activate VIP for instant ₹${economy.vipMinWithdrawal} threshold.`}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-white font-mono">
              ₹{balance.toFixed(2)}
            </span>
            <span className="text-xs text-white/40 font-mono block">
              / ₹{minThreshold.toFixed(0)} min
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="h-3 w-full bg-[#0A0A0C] rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isVIP
                  ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-300 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                  : 'bg-gradient-to-r from-[#00FF87] to-cyan-400 shadow-[0_0_12px_rgba(0,255,135,0.4)]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-white/40">
            <span>{progressPercent.toFixed(1)}% unlocked</span>
            {canWithdraw ? (
              <span className="text-[#00FF87] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Payout Ready
              </span>
            ) : (
              <span className="text-white/40">
                ₹{remaining.toFixed(2)} remaining to cashout
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleOpenWithdrawModal}
            disabled={!canWithdraw}
            className={`w-full sm:w-auto flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 ${
              canWithdraw
                ? requiresPayment
                  ? 'bg-[#D4AF37] text-black hover:bg-[#e0be47] shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-95'
                  : isVIP
                  ? 'bg-[#D4AF37] text-black hover:bg-[#e0be47] shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-95'
                  : 'bg-[#00FF87] text-[#0A0A0C] hover:bg-[#20ff97] shadow-[0_0_15px_rgba(0,255,135,0.3)] active:scale-95'
                : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
            }`}
          >
            {requiresPayment ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Unlock Withdrawal (Pay ₹{paymentConfig.activationFee})</span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Request UPI / Bank Payout</span>
              </>
            )}
          </button>

          {!isVIP && (
            <button
              onClick={() => setActiveTab('vip')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Bypass with VIP (₹50 Min)</span>
            </button>
          )}
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Payout Requests & Settlements
            </h4>
          </div>
          <span className="text-xs font-mono text-white/40">
            {withdrawals.length} Recorded • <span className="text-[#00FF87]">Tap for Full Details</span>
          </span>
        </div>

        {withdrawals.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-xs font-mono">
            No withdrawal records yet. Keep sharing data to reach threshold!
          </div>
        ) : (
          <div className="space-y-2.5">
            {withdrawals.map((wd) => {
              const statusStyles = {
                paid: 'bg-[#00FF87]/15 text-[#00FF87] border-[#00FF87]/30',
                processing: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30',
                pending: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
                rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
              }[wd.status];

              return (
                <div
                  key={wd.id}
                  onClick={() => setSelectedWithdrawalDetail(wd)}
                  className="p-3.5 rounded-xl bg-[#0A0A0C] hover:bg-[#121216] border border-white/5 hover:border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all cursor-pointer group shadow-sm"
                  title="Click to view full settlement receipt and UTR details"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-[#00FF87]/10 group-hover:text-[#00FF87] flex items-center justify-center text-white/70 shrink-0 transition-colors">
                      {wd.method === 'UPI' ? <QrCode className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono group-hover:text-[#00FF87] transition-colors">
                          ₹{wd.amount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">({wd.method})</span>
                        {wd.isVIPPriority && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                            VIP
                          </span>
                        )}
                        <span className="text-[10px] text-cyan-400/80 font-mono hidden sm:inline-flex items-center gap-1 group-hover:underline">
                          <Receipt className="w-3 h-3" /> View Details
                        </span>
                      </div>
                      <div className="text-[11px] text-white/40 font-mono truncate max-w-xs sm:max-w-sm">
                        {wd.paymentDetail}
                      </div>
                      {wd.txnRef && (
                        <div className="text-[10px] text-[#00FF87] font-mono mt-0.5">
                          Ref: {wd.txnRef}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${statusStyles}`}
                    >
                      {wd.status}
                    </span>
                    <span className="text-[10px] text-white/30 font-mono flex items-center gap-1">
                      {new Date(wd.requestedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0C0C0E] p-6 border border-white/15 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#00FF87]" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Request Payout
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount input */}
              <div>
                <label className="block text-xs font-mono text-white/40 mb-1">
                  Withdrawal Amount (₹) - Available: ₹{balance.toFixed(2)}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={minThreshold}
                    max={balance}
                    step="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={minThreshold.toString()}
                    className="w-full pl-8 pr-16 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] font-mono text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(Math.floor(balance).toString())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/80"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Method selector */}
              <div>
                <label className="block text-xs font-mono text-white/40 mb-1">
                  Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('UPI')}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all ${
                      method === 'UPI'
                        ? 'bg-[#00FF87]/15 border-[#00FF87] text-[#00FF87]'
                        : 'bg-[#0A0A0C] border-white/10 text-white/40'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Instant UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('BANK_TRANSFER')}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all ${
                      method === 'BANK_TRANSFER'
                        ? 'bg-[#00FF87]/15 border-[#00FF87] text-[#00FF87]'
                        : 'bg-[#0A0A0C] border-white/10 text-white/40'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Bank IMPS</span>
                  </button>
                </div>
              </div>

              {/* Destination info */}
              {method === 'UPI' ? (
                <div>
                  <label className="block text-xs font-mono text-white/40 mb-1">
                    UPI ID / VPA Address
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentDetail}
                    onChange={(e) => setPaymentDetail(e.target.value)}
                    placeholder="e.g. yourname@oksbi or 9876543210@paytm"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] font-mono text-white text-sm"
                  />
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-mono text-white/40 mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentDetail}
                      onChange={(e) => setPaymentDetail(e.target.value)}
                      placeholder="e.g. 50100293841029"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] font-mono text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/40 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      required
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      placeholder="e.g. HDFC0001092"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] font-mono text-white text-sm uppercase"
                    />
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-white/5 text-[11px] text-white/40 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Transfer Fee:</span>
                  <span className="text-[#00FF87] font-bold">₹0.00 (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Speed:</span>
                  <span className="text-white">{isVIP ? '⚡ Instant 24/7' : '⏱ Standard Batch (24 hrs)'}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 font-mono text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-[#0A0A0C] font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,255,135,0.3)]"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
