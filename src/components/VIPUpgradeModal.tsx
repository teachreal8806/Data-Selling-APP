import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const VIPUpgradeModal: React.FC = () => {
  const { user, economy, submitVIPPayment, vipSubmissions, adminApproveVIP, notifyToast, setActiveView } = useData();
  const [upiIdInput, setUpiIdInput] = useState(user.upiId || 'aarav99@oksbi');
  const [utrNumber, setUtrNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isVIP = user.tier === 'vip';
  const myPendingSubmission = vipSubmissions.find(
    (s) => (s.userId === user.id || s.userName === user.name) && s.status === 'pending'
  );

  const officialUPI = 'dataselling.pay@axisbank';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `upi://pay?pa=${officialUPI}&pn=DataSelling%20VIP&am=${economy.vipActivationFee}&cu=INR`
  )}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(officialUPI);
    setCopied(true);
    notifyToast('Official VIP UPI ID copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const ok = submitVIPPayment({
        upiId: upiIdInput,
        utrNumber,
      });
      setSubmitting(false);
      if (ok) {
        setUtrNumber('');
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0C0C0E] border border-[#D4AF37]/30 relative overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.08)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] glow-gold shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  VIP Node Tier Activation
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-[#D4AF37] text-black">
                  ₹{economy.vipActivationFee} One-Time
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1 max-w-xl">
                Unlock high-frequency packet allocation, instant automated UPI withdrawals 24/7, and an unconditional +15% yield multiplier on all shared gigabytes.
              </p>
            </div>
          </div>

          {isVIP && (
            <div className="px-4 py-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>ACTIVE VIP MEMBER</span>
            </div>
          )}
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standard Tier */}
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10 opacity-75">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-white/80 tracking-tight">Standard Node</h4>
              <span className="text-xs text-white/40 font-mono">Default Tier (Free)</span>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-white/50">Current Base</span>
          </div>
          <ul className="space-y-2.5 text-xs text-white/50 font-mono">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span>Base Bandwidth Payout: <strong className="text-white">₹{economy.ratePerGB}/GB</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span>Withdrawal Threshold: <strong className="text-white">₹{economy.standardMinWithdrawal}</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span>Payout Processing: <strong className="text-white">24-48 Hours Batch</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span>Network Priority: <strong className="text-white">Standard Mesh Routing</strong></span>
            </li>
          </ul>
        </div>

        {/* VIP Tier */}
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-[#D4AF37]/40 relative shadow-[0_0_20px_rgba(212,175,55,0.08)]">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-mono font-black uppercase shadow-sm">
            Recommended
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-[#D4AF37] tracking-tight flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#D4AF37]" /> VIP Prime Node
              </h4>
              <span className="text-xs text-[#D4AF37]/70 font-mono">₹{economy.vipActivationFee} Lifetime License</span>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">15% Higher Yield</span>
          </div>
          <ul className="space-y-2.5 text-xs text-[#D4AF37]/90 font-mono">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>+15% Yield Bonus: <strong className="text-white">₹{(economy.ratePerGB * economy.vipMultiplier).toFixed(2)}/GB</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Lower Cashout Threshold: <strong className="text-white">₹{economy.vipMinWithdrawal} Minimum</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Payout Speed: <strong className="text-white">⚡ Instant 24/7 Automated UPI</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Priority Relay: <strong className="text-white">Top Tier Packet Allocation</strong></span>
            </li>
          </ul>
        </div>
      </div>

      {/* Activation Steps & Payment Interface */}
      {!isVIP && (
        <div className="p-6 rounded-2xl bg-[#0C0C0E] border border-white/10 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              2-Step VIP Activation Procedure
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Scan & Pay */}
            <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 flex flex-col items-center text-center">
              <span className="px-2.5 py-0.5 rounded bg-white/10 text-[10px] font-mono font-bold text-white/80 mb-3">
                STEP 1: SCAN & PAY ₹{economy.vipActivationFee}
              </span>

              {/* QR Code Container */}
              <div className="p-3 bg-white rounded-xl shadow-lg mb-3 inline-block">
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-40 h-40 block"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="w-full space-y-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0C0C0E] border border-white/10 text-xs font-mono">
                  <span className="text-white/60 truncate">{officialUPI}</span>
                  <button
                    onClick={handleCopyUPI}
                    className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0 ml-2"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-white/40 font-mono">
                  Supports GPay, PhonePe, Paytm, CRED, Amazon Pay, BHIM.
                </p>
              </div>
            </div>

            {/* Step 2: Submit UTR Reference */}
            <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-white/10 text-[10px] font-mono font-bold text-white/80 mb-3 inline-block">
                  STEP 2: SUBMIT 12-DIGIT UTR NUMBER
                </span>

                <p className="text-xs text-white/70 mb-4">
                  After completing the ₹99 payment in your UPI app, find the 12-digit <strong>UTR / UPI Transaction ID</strong> in transaction details and paste it below.
                </p>

                {myPendingSubmission ? (
                  <div className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-mono space-y-2">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Verification Pending in Queue</span>
                    </div>
                    <p className="text-white/80">
                      Submitted UTR: <strong className="text-white">{myPendingSubmission.utrNumber}</strong>
                    </p>
                    <p className="text-[11px] text-white/40">
                      Admin operators verify UTRs every 5-10 minutes.
                    </p>
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => adminApproveVIP(myPendingSubmission.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs hover:bg-[#e0be47] transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Instant Auto-Approve (Demo)</span>
                      </button>
                      <button
                        onClick={() => setActiveView('admin')}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 text-xs hover:bg-white/20 transition-all"
                      >
                        View in Admin Panel →
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-white/40 mb-1">
                        Your UPI ID (For Confirmation)
                      </label>
                      <input
                        type="text"
                        required
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full px-3 py-2 rounded-xl bg-[#0C0C0E] border border-white/10 focus:border-[#D4AF37] font-mono text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-white/40 mb-1">
                        12-Digit UTR / Transaction Reference ID
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 423984019284"
                        className="w-full px-3 py-2 rounded-xl bg-[#0C0C0E] border border-white/10 focus:border-[#D4AF37] font-mono text-white text-xs uppercase"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !utrNumber}
                      className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Validating Reference...</span>
                      ) : (
                        <>
                          <Crown className="w-4 h-4" />
                          <span>Submit UTR for VIP Activation</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/40 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00FF87]" />
                <span>100% Encrypted & Authenticated Gateway</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
