import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Copy,
  Check,
  Building2,
  QrCode,
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
  ArrowDownRight,
  Receipt,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const WithdrawalDetailsModal: React.FC = () => {
  const { selectedWithdrawalDetail, setSelectedWithdrawalDetail, notifyToast } = useData();
  const [copied, setCopied] = useState(false);

  if (!selectedWithdrawalDetail) return null;

  const wd = selectedWithdrawalDetail;

  const statusConfig = {
    paid: {
      label: 'Settlement Completed',
      color: 'text-[#00FF87] bg-[#00FF87]/15 border-[#00FF87]/40',
      icon: CheckCircle2,
      desc: 'Funds have been successfully dispatched via automated UPI/IMPS clearing node.',
      stepIndex: 4,
    },
    processing: {
      label: 'Dispatch In Progress',
      color: 'text-[#D4AF37] bg-[#D4AF37]/15 border-[#D4AF37]/40',
      icon: Clock,
      desc: 'Queued in VIP Fast-Track UPI router. Bank IMPS acknowledgment pending.',
      stepIndex: 3,
    },
    pending: {
      label: 'Verification Pending',
      color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/40',
      icon: Clock,
      desc: 'Standard batch validation queue. Verification cycle runs continuously.',
      stepIndex: 2,
    },
    rejected: {
      label: 'Transaction Declined',
      color: 'text-red-400 bg-red-500/15 border-red-500/40',
      icon: XCircle,
      desc: 'Invalid UPI ID or destination bank rejection. Balance refunded to node account.',
      stepIndex: 1,
    },
  }[wd.status] || {
    label: 'Pending',
    color: 'text-white/60 bg-white/10 border-white/20',
    icon: Clock,
    desc: 'Pending review',
    stepIndex: 1,
  };

  const StatusIcon = statusConfig.icon;

  const handleCopyDetails = () => {
    const text = `--- DATA SELLING PAYOUT RECEIPT ---
Receipt ID: ${wd.id}
User: ${wd.userName}
Amount: INR ₹${wd.amount.toFixed(2)}
Method: ${wd.method}
Destination: ${wd.paymentDetail}
Status: ${wd.status.toUpperCase()}
Requested: ${new Date(wd.requestedAt).toLocaleString()}
Reference / UTR: ${wd.txnRef || 'PENDING_GENERATION'}
Network: Lumina P2P Mesh Banking Gateway
------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    notifyToast('Withdrawal settlement details copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateDownload = () => {
    notifyToast(`Downloaded official payout receipt for ₹${wd.amount.toFixed(2)} (${wd.id})`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#0C0C0E] border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
        {/* Header Ribbon */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/[0.03] to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00FF87]/15 border border-[#00FF87]/30 text-[#00FF87] flex items-center justify-center shadow-sm">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Payout Settlement Receipt
                {wd.isVIPPriority && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                    VIP Instant
                  </span>
                )}
              </h3>
              <p className="text-[11px] font-mono text-white/40">
                Transaction ID: <span className="text-white/80">{wd.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedWithdrawalDetail(null)}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto custom-scrollbar">
          {/* Main Amount Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#121216] to-[#0A0A0C] border border-white/10 text-center relative overflow-hidden">
            <div className="text-[11px] font-mono uppercase font-bold text-white/40 tracking-wider mb-1">
              Net Amount Dispatched
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight text-glow">
              ₹{wd.amount.toFixed(2)}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-sm ${statusConfig.color}">
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusConfig.label}</span>
            </div>
            <p className="text-[11px] text-white/50 font-sans mt-2 max-w-sm mx-auto">
              {statusConfig.desc}
            </p>
          </div>

          {/* 4-Step Settlement Stepper */}
          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-3">
            <span className="text-[10px] font-mono uppercase font-bold text-white/40 tracking-wider block">
              Automated Mesh Clearing Progress
            </span>

            <div className="space-y-3 font-mono text-xs">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00FF87] text-black font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,135,0.4)]">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-white text-xs">1. Withdrawal Requested</p>
                  <p className="text-[11px] text-white/40">
                    {new Date(wd.requestedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00FF87] text-black font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,135,0.4)]">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-white text-xs">2. Automated Security & UTR Audit</p>
                  <p className="text-[11px] text-white/40">
                    Zero-knowledge bandwidth verification verified
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
                    statusConfig.stepIndex >= 3
                      ? 'bg-[#00FF87] text-black shadow-[0_0_8px_rgba(0,255,135,0.4)]'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {statusConfig.stepIndex >= 3 ? '✓' : '3'}
                </div>
                <div>
                  <p className="font-bold text-white text-xs">3. IMPS / UPI Network Relay Dispatch</p>
                  <p className="text-[11px] text-white/40">
                    {statusConfig.stepIndex >= 3
                      ? 'Direct bank clearance channel connected'
                      : 'Awaiting scheduled batch release'}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
                    statusConfig.stepIndex >= 4
                      ? 'bg-[#00FF87] text-black shadow-[0_0_8px_rgba(0,255,135,0.4)]'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {statusConfig.stepIndex >= 4 ? '✓' : '4'}
                </div>
                <div>
                  <p className="font-bold text-white text-xs">4. Credited to Beneficiary Account</p>
                  <p className="text-[11px] text-white/40">
                    {wd.processedAt
                      ? `Settled at ${new Date(wd.processedAt).toLocaleString()}`
                      : 'Pending final bank network acknowledgment'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Transaction Details Ledger */}
          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-3 font-mono text-xs">
            <span className="text-[10px] font-mono uppercase font-bold text-white/40 tracking-wider block">
              Settlement Ledger Specifications
            </span>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/40">Beneficiary Name</span>
                <span className="font-bold text-white">{wd.userName}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/40">Payout Method</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  {wd.method === 'UPI' ? <QrCode className="w-3.5 h-3.5 text-[#00FF87]" /> : <Building2 className="w-3.5 h-3.5 text-cyan-400" />}
                  {wd.method === 'UPI' ? 'Instant UPI VPA' : 'Bank IMPS Express'}
                </span>
              </div>

              <div className="flex justify-between items-start py-1 border-b border-white/5">
                <span className="text-white/40">Receiving Detail</span>
                <span className="font-bold text-white text-right break-all max-w-[220px]">
                  {wd.paymentDetail}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/40">Bank Ref / UTR</span>
                <span className="font-bold text-[#00FF87] font-mono">
                  {wd.txnRef || 'GENERATING_ON_CLEARANCE'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/40">Platform Processing Fee</span>
                <span className="font-bold text-[#00FF87]">₹0.00 (100% Free)</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-white/40">Encrypted Proof Seal</span>
                <span className="text-[11px] text-white/60 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00FF87]" />
                  SHA-256 Verified
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCopyDetails}
              className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-[#00FF87]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Receipt' : 'Copy Details'}</span>
            </button>

            <button
              onClick={handleSimulateDownload}
              className="flex-1 py-3 px-4 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
