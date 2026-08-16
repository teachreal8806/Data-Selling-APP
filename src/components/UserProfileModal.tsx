import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Wallet,
  Crown,
  Share2,
  Copy,
  CheckCircle2,
  LogOut,
  Shield,
  Zap,
  Save
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const UserProfileModal: React.FC = () => {
  const {
    user,
    userProfileModalOpen,
    setUserProfileModalOpen,
    updateProfile,
    logout,
    notifyToast,
    setAuthModalOpen,
    setAuthModalTab,
  } = useData();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [upiId, setUpiId] = useState(user.upiId);
  const [copied, setCopied] = useState(false);

  if (!userProfileModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, upiId });
    setUserProfileModalOpen(false);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://dataselling.network/join?ref=${user.referralCode}`);
    setCopied(true);
    notifyToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#0C0C0E] border border-white/15 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,255,135,0.08)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FF87] to-transparent" />

        <button
          onClick={() => setUserProfileModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00FF87] to-[#06B6D4] flex items-center justify-center text-black font-bold text-xl shadow-[0_0_20px_rgba(0,255,135,0.3)]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">{user.name}</h3>
              {user.tier === 'vip' ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37] text-black flex items-center gap-1">
                  <Crown className="w-3 h-3" /> VIP
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                  STANDARD
                </span>
              )}
            </div>
            <p className="text-xs text-white/50 font-mono mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#0A0A0C] border border-white/5">
            <span className="text-[10px] font-mono text-white/50 uppercase">Current Balance</span>
            <div className="text-lg font-bold font-mono text-[#00FF87] mt-1">
              ₹{user.balanceINR.toFixed(2)}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0A0A0C] border border-white/5">
            <span className="text-[10px] font-mono text-white/50 uppercase">Lifetime Earned</span>
            <div className="text-lg font-bold font-mono text-white mt-1">
              ₹{user.lifetimeEarningsINR.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-white/70">Display Name</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-white/70">Mobile Number</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-white/70">UPI ID for Payout Settlements</label>
            <div className="relative">
              <Wallet className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourupi@bank"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="p-3.5 rounded-2xl bg-[#0A0A0C] border border-[#D4AF37]/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#D4AF37] block font-bold">Your Referral Code</span>
              <span className="text-sm font-mono font-bold text-white tracking-wider">{user.referralCode}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyReferral}
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,135,0.25)] transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUserProfileModalOpen(false);
                logout();
                setAuthModalTab('login');
                setAuthModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
