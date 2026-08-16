import React from 'react';
import {
  Zap,
  Crown,
  Shield,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRightLeft,
  LayoutDashboard,
  Smartphone,
  Wallet,
  Activity
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const Navbar: React.FC = () => {
  const {
    user,
    activeView,
    setActiveView,
    toggleSound,
    triggerAIAdvisor,
    economy,
  } = useData();

  const isVIP = user.tier === 'vip';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0C]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00FF87] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,135,0.4)] shrink-0">
            <Activity className="w-5 h-5 text-[#0A0A0C] stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                DataRefine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider bg-white/10 text-white/70">
                Nexus
              </span>
              {isVIP && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.25)]">
                  <Crown className="w-3 h-3" /> VIP
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/40 font-mono hidden sm:block">
              Autonomous Bandwidth Monetization
            </p>
          </div>
        </div>

        {/* Live Balance & Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Advisor Button */}
          <button
            onClick={triggerAIAdvisor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-all hover:bg-white/10"
            title="AI Network Optimizer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00FF87] animate-pulse" />
            <span className="hidden md:inline">AI Optimizer</span>
          </button>

          {/* User Balance Badge */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider font-mono leading-none mb-1">
                Balance
              </p>
              <p className="text-base font-bold text-[#00FF87] font-mono leading-none">
                ₹{user.balanceINR.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border transition-all ${
              user.soundEnabled
                ? 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
            title={user.soundEnabled ? 'Mute SFX' : 'Unmute SFX'}
          >
            {user.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Switch View Toggle (User PWA vs Admin Control) */}
          <button
            onClick={() => setActiveView(activeView === 'user' ? 'admin' : 'user')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
              activeView === 'admin'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
            }`}
          >
            {activeView === 'user' ? (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="sm:hidden">Admin</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">User View</span>
                <span className="sm:hidden">App</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Surge Banner if active */}
      {economy.surgeActive && (
        <div className="bg-[#D4AF37] px-4 py-1 text-center text-xs font-bold text-black font-mono tracking-wide shadow-md">
          ⚡ {economy.surgeLabel} (+50% GLOBAL EARNING BOOST ACTIVE)
        </div>
      )}
    </header>
  );
};

