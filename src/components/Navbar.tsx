import React, { useRef } from 'react';
import {
  Zap,
  Crown,
  Shield,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  LogIn,
  Activity,
  LogOut
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
    setAdminPasscodeModalOpen,
    isAdminUnlocked,
    lockAdminPanel,
    setUserProfileModalOpen,
    setAuthModalOpen,
    setAuthModalTab,
    isAuthenticated,
    notifyToast,
  } = useData();

  const isVIP = user.tier === 'vip';
  const lastTapRef = useRef<number>(0);

  // Double tap / double click detection for hidden Admin Panel
  const handleBrandDoubleInteraction = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 400; // ms

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap confirmed!
      if (activeView === 'admin') {
        notifyToast('Admin panel already open.', 'info');
      } else if (isAdminUnlocked) {
        setActiveView('admin');
        notifyToast('Switched to Admin Governance Panel.', 'gold');
      } else {
        setAdminPasscodeModalOpen(true);
        notifyToast('🔐 Admin Security Gate triggered.', 'info');
      }
    }
    lastTapRef.current = now;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0C]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo with Double-Tap Hidden Admin Trigger */}
        <div
          onClick={handleBrandDoubleInteraction}
          onDoubleClick={() => {
            if (activeView === 'admin') {
              notifyToast('Admin panel already open.', 'info');
            } else if (isAdminUnlocked) {
              setActiveView('admin');
              notifyToast('Switched to Admin Governance Panel.', 'gold');
            } else {
              setAdminPasscodeModalOpen(true);
            }
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
          title="Double-click to access Admin Gate"
        >
          <div className="w-10 h-10 bg-[#00FF87] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,135,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <Zap className="w-5 h-5 text-[#0A0A0C] stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#00FF87] transition-colors">
                Data Selling
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

        {/* Live Balance & User Actions */}
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
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-2xl">
            <div className="text-right">
              <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider font-mono leading-none mb-1">
                Balance
              </p>
              <p className="text-sm sm:text-base font-bold text-[#00FF87] font-mono leading-none">
                ₹{user.balanceINR.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              user.soundEnabled
                ? 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
            title={user.soundEnabled ? 'Mute SFX' : 'Unmute SFX'}
          >
            {user.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Account Profile / Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={() => setUserProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-mono transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-[#00FF87] text-black font-bold text-[10px] flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-bold truncate max-w-[90px]">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalTab('login');
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,255,135,0.25)] transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* If actively in Admin view, show Exit Admin button */}
          {activeView === 'admin' && (
            <button
              onClick={lockAdminPanel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black text-xs font-bold font-mono shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
              title="Lock Admin & Return to App"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Surge Banner if active */}
      {economy.surgeActive && (
        <div className="bg-[#D4AF37] px-4 py-1 text-center text-xs font-bold text-black font-mono tracking-wide shadow-md">
          ⚡ {economy.surgeLabel} (+50% GLOBAL DATA MONETIZATION BOOST ACTIVE)
        </div>
      )}
    </header>
  );
};
