import React, { useState } from 'react';
import {
  Users,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Award,
  Gift,
  Shield,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const ReferralSystem: React.FC = () => {
  const { user, economy, referrals, notifyToast } = useData();
  const [copied, setCopied] = useState(false);

  const referralUrl = `https://dataselling.network/join?ref=${user.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    notifyToast('Unique referral invite link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Data Selling Network',
        text: `Monetize your unused internet data and earn 24/7 instant UPI cash with Data Selling! Use my invite code: ${user.referralCode}`,
        url: referralUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const totalRoyaltyEarned = referrals.reduce((sum, r) => sum + r.royaltyEarnedINR, 0);
  const activeNodesCount = referrals.filter(r => r.status === 'active').length;

  // Referral tier ranking
  let currentRank = 'Bronze Affiliate';
  let nextRank = 'Silver Master';
  let progressToNext = (referrals.length / 10) * 100;
  if (referrals.length >= 20) {
    currentRank = 'Gold Sovereign';
    nextRank = 'Diamond Apex';
    progressToNext = 100;
  } else if (referrals.length >= 5) {
    currentRank = 'Silver Master';
    nextRank = 'Gold Sovereign';
    progressToNext = ((referrals.length - 5) / 15) * 100;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="p-6 rounded-2xl bg-[#0C0C0E] border border-white/10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#00FF87]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF87]/15 border border-[#00FF87]/30 flex items-center justify-center text-[#00FF87] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  3-Tier Referral Multiplier
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00FF87]/20 text-[#00FF87] border border-[#00FF87]/30">
                  {currentRank}
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1 max-w-xl">
                Earn lifetime passive royalties from every MB shared across 3 generations of your network mesh.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-white/40 font-mono block uppercase">Lifetime Royalties</span>
              <span className="text-xl font-bold text-[#00FF87] font-mono">
                ₹{totalRoyaltyEarned.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Invite Code Bar */}
        <div className="mt-6 p-4 rounded-xl bg-[#0A0A0C] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-white/40">Your Code:</span>
            <span className="text-base font-bold font-mono text-white tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/10">
              {user.referralCode}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Link</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-[#0A0A0C] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Invite</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Tier Multiplier Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tier 1 */}
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-[#00FF87]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#00FF87]/20 text-[#00FF87]">
              Level 1 (Direct)
            </span>
            <span className="text-base font-bold text-[#00FF87] font-mono">
              {economy.tierCommissions.tier1}%
            </span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">Direct Node Invites</h4>
          <p className="text-[11px] text-white/50 mt-1">
            Earn {economy.tierCommissions.tier1}% lifetime royalty on every single megabyte shared by your direct referrals.
          </p>
        </div>

        {/* Tier 2 */}
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300">
              Level 2 (Downline)
            </span>
            <span className="text-base font-bold text-cyan-300 font-mono">
              {economy.tierCommissions.tier2}%
            </span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">Secondary Mesh</h4>
          <p className="text-[11px] text-white/50 mt-1">
            Earn {economy.tierCommissions.tier2}% on all node activity invited by your direct referrals.
          </p>
        </div>

        {/* Tier 3 */}
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-[#D4AF37]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#D4AF37]/20 text-[#D4AF37]">
              Level 3 (Ecosystem)
            </span>
            <span className="text-base font-bold text-[#D4AF37] font-mono">
              {economy.tierCommissions.tier3}%
            </span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">Tertiary Network</h4>
          <p className="text-[11px] text-white/50 mt-1">
            Earn {economy.tierCommissions.tier3}% passive income from level 3 network mesh expansion.
          </p>
        </div>
      </div>

      {/* Downline Members Matrix Table */}
      <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-white/40" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Your Referral Downline Mesh ({referrals.length} Nodes)
            </h4>
          </div>
          <span className="text-xs font-mono text-white/40">
            {activeNodesCount} Active Nodes
          </span>
        </div>

        <div className="space-y-2.5">
          {referrals.map((member) => (
            <div
              key={member.id}
              className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0C0C0E] border border-white/20 flex items-center justify-center font-bold text-white text-xs">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      {member.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                        member.tierLevel === 1
                          ? 'bg-[#00FF87]/20 text-[#00FF87]'
                          : member.tierLevel === 2
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                      }`}
                    >
                      Tier {member.tierLevel}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40 font-mono mt-0.5">
                    Joined {member.joinedDate} • {(member.dataSharedMB / 1024).toFixed(1)} GB Shared
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-[#00FF87] font-mono">
                  +₹{member.royaltyEarnedINR.toFixed(2)}
                </div>
                <span className="text-[10px] text-white/40 font-mono">
                  {member.status === 'active' ? (
                    <span className="text-[#00FF87] font-semibold">● Sharing Now</span>
                  ) : (
                    <span className="text-white/30">○ Idle</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
