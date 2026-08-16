import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Wifi,
  ArrowDown,
  ArrowUp,
  Wallet,
  Sparkles,
  Volume2,
  VolumeX,
  User,
  Shield,
  LogOut,
  LogIn,
  ChevronDown,
  ExternalLink,
  Crown,
  Lock,
  Activity,
  HelpCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    user,
    telemetry,
    economy,
    activeView,
    setActiveView,
    setActiveTab,
    toggleSound,
    triggerAIAdvisor,
    setAdminPasscodeModalOpen,
    isAdminUnlocked,
    lockAdminPanel,
    setUserProfileModalOpen,
    setAuthModalOpen,
    setAuthModalTab,
    isAuthenticated,
    logout,
    notifyToast,
  } = useData();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isVIP = user.tier === 'vip';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uploadSpeedMBps = user.isSharing
    ? (telemetry.liveThroughputKBps / 1024).toFixed(2)
    : '0.00';
  
  const downloadSpeedMbps = user.isSharing ? '32.4' : '24.8';

  return (
    <header className="sticky top-0 z-20 w-full bg-[#080B11]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left Section: Mobile Menu + Connected Device & Telemetry Chips */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* 1 Device Connected Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  user.isSharing ? 'bg-[#00FF87]' : 'bg-emerald-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  user.isSharing ? 'bg-[#00FF87]' : 'bg-emerald-400'
                }`}
              ></span>
            </span>
            <span className="text-white/80 font-medium hidden xs:inline">1 Device Connected</span>
            <span className="text-white/80 font-medium xs:hidden">1 Device</span>
          </div>

          {/* Live Telemetry Chips (Desktop / Tablet) */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-white/70">
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>{downloadSpeedMbps} Mbps</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-white/70">
              <ArrowUp className="w-3.5 h-3.5 text-[#00FF87]" />
              <span>{uploadSpeedMBps} MB/s</span>
            </div>
          </div>
        </div>

        {/* Right Section: Balance + SFX + User Avatar Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Advisor Button */}
          <button
            onClick={triggerAIAdvisor}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-all hover:bg-white/10"
            title="AI Network Optimizer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00FF87] animate-pulse" />
            <span className="hidden md:inline">AI Optimizer</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              user.soundEnabled
                ? 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
            title={user.soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          >
            {user.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Available Balance Pill */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#00FF87]/10 to-transparent border border-[#00FF87]/30 px-3 sm:px-3.5 py-1.5 rounded-xl hover:border-[#00FF87]/60 transition-all text-left group"
            title="Click to view wallet and withdraw"
          >
            <Wallet className="w-4 h-4 text-[#00FF87] shrink-0" />
            <div>
              <p className="text-[9px] text-white/50 uppercase font-bold tracking-wider font-mono leading-none mb-0.5">
                Balance
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-[#00FF87] font-mono leading-none">
                ₹{user.balanceINR.toFixed(2)}
              </p>
            </div>
          </button>

          {/* User Profile / Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-mono"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00FF87] to-emerald-600 text-black font-extrabold text-xs flex items-center justify-center shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="flex items-center gap-1 font-bold text-white leading-none">
                    <span className="truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
                    {isVIP && <Crown className="w-3 h-3 text-[#D4AF37]" />}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/40 hidden sm:block" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,255,135,0.2)] transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0C101D] border border-white/15 shadow-2xl p-2 z-50 animate-fade-in text-xs font-mono">
                {/* Profile Header */}
                <div className="p-2.5 border-b border-white/10 mb-1">
                  <p className="font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-white/50 truncate font-sans">{user.email || user.phone}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        isVIP
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {isVIP ? 'VIP Tier Pro' : 'Standard Tier'}
                    </span>
                    <span className="text-[10px] text-[#00FF87] font-bold">
                      ₹{user.balanceINR.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Menu Options */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setUserProfileModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <User className="w-4 h-4 text-white/60" />
                    <span>Profile & UPI Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('wallet');
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <Wallet className="w-4 h-4 text-[#00FF87]" />
                    <span>Withdraw Funds</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('vip');
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                    <span>VIP Membership</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('diagnostics');
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>Help & Telegram Support</span>
                  </button>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* If currently in Admin view, show Exit Admin button */}
          {activeView === 'admin' && (
            <button
              onClick={lockAdminPanel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black text-xs font-bold font-mono shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
              title="Lock Admin & Return to App"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Surge Banner if active */}
      {economy.surgeActive && (
        <div className="bg-gradient-to-r from-amber-500 via-[#D4AF37] to-amber-500 px-4 py-1 text-center text-xs font-bold text-black font-mono tracking-wide shadow-md">
          ⚡ {economy.surgeLabel} (+50% GLOBAL MONETIZATION BOOST ACTIVE)
        </div>
      )}
    </header>
  );
};
