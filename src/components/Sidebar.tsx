import React, { useRef } from 'react';
import {
  LayoutDashboard,
  Radio,
  Zap,
  Wallet,
  History,
  Users,
  Crown,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  Activity,
  CheckCircle2,
  ChevronRight,
  Shield,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    activeView,
    setActiveView,
    user,
    economy,
    triggerAIAdvisor,
    setUserProfileModalOpen,
    setAuthModalOpen,
    setAuthModalTab,
    isAuthenticated,
    logout,
    isAdminUnlocked,
    setAdminPasscodeModalOpen,
    notifyToast,
  } = useData();

  const isVIP = user.tier === 'vip';
  const lastTapRef = useRef<number>(0);

  const handleBrandInteraction = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 400;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap confirmed
      if (activeView === 'admin') {
        notifyToast('Admin panel is already active.', 'info');
      } else if (isAdminUnlocked) {
        setActiveView('admin');
        notifyToast('Switched to Super Admin Governance.', 'gold');
      } else {
        setAdminPasscodeModalOpen(true);
        notifyToast('🔐 Admin Security Gate triggered.', 'info');
      }
    }
    lastTapRef.current = now;
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: user.isSharing ? 'LIVE' : undefined,
    },
    {
      id: 'refinery',
      label: 'Bandwidth Sharing',
      icon: Radio,
      badge: user.isSharing ? 'ACTIVE' : undefined,
    },
    {
      id: 'quicksell',
      label: 'Quick Sell Grid',
      icon: Zap,
      highlight: true,
    },
    {
      id: 'wallet',
      label: 'Payouts',
      icon: Wallet,
    },
    {
      id: 'history',
      label: 'Transactions',
      icon: History,
    },
    {
      id: 'referrals',
      label: 'Referral Program',
      icon: Users,
      badge: '3-Tier',
    },
    {
      id: 'vip',
      label: 'VIP Membership',
      icon: Crown,
      vip: true,
      badge: isVIP ? 'PRO' : `₹${economy.vipActivationFee}`,
    },
  ];

  const handleNavClick = (tabId: string) => {
    if (activeView === 'admin') {
      setActiveView('user');
    }
    setActiveTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Branding & Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div
            onClick={handleBrandInteraction}
            onDoubleClick={() => {
              if (activeView === 'admin') {
                notifyToast('Admin panel is already active.', 'info');
              } else if (isAdminUnlocked) {
                setActiveView('admin');
                notifyToast('Switched to Super Admin Governance.', 'gold');
              } else {
                setAdminPasscodeModalOpen(true);
              }
            }}
            className="flex items-center gap-3 cursor-pointer group"
            title="Double-click to access Super Admin Gate"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF87] to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,135,0.35)] group-hover:scale-105 transition-transform shrink-0">
              <Zap className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white group-hover:text-[#00FF87] transition-colors">
                  Data Selling
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-white/10 text-white/70">
                  v3.0
                </span>
              </div>
              <p className="text-[11px] text-white/40 font-mono tracking-tight">
                Monetize Your Internet
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-white/40 font-bold">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeView === 'user' &&
              (activeTab === item.id ||
                (activeTab === 'payouts' && item.id === 'wallet') ||
                (!activeTab && item.id === 'dashboard'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 group ${
                  isActive
                    ? item.vip
                      ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                      : 'bg-[#00FF87] text-black font-bold shadow-[0_0_20px_rgba(0,255,135,0.25)]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-black'
                        : item.vip
                        ? 'text-[#D4AF37]'
                        : 'text-white/60 group-hover:text-[#00FF87]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase font-mono ${
                      isActive
                        ? 'bg-black/20 text-black'
                        : item.badge === 'LIVE' || item.badge === 'ACTIVE'
                        ? 'bg-[#00FF87]/20 text-[#00FF87] animate-pulse'
                        : item.vip
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-white/40 font-bold">
            Utilities
          </div>

          {/* AI Optimizer */}
          <button
            onClick={() => {
              triggerAIAdvisor();
              if (setMobileOpen) setMobileOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#00FF87] animate-pulse group-hover:scale-110 transition-transform" />
              <span>AI Optimizer</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              AI Engine
            </span>
          </button>

          {/* Settings / Profile */}
          <button
            onClick={() => {
              setUserProfileModalOpen(true);
              if (setMobileOpen) setMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all group"
          >
            <Settings className="w-4 h-4 text-white/60 group-hover:text-white group-hover:scale-110 transition-transform" />
            <span>Settings & Profile</span>
          </button>

          {/* Support / Network Diagnostics */}
          <button
            onClick={() => handleNavClick('diagnostics')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all group ${
              activeTab === 'diagnostics' && activeView === 'user'
                ? 'bg-[#00FF87] text-black font-bold shadow-[0_0_20px_rgba(0,255,135,0.25)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-white/60 group-hover:text-white group-hover:scale-110 transition-transform" />
            <span>Support & Health</span>
          </button>
        </nav>
      </div>

      {/* Bottom Section: System Status + VIP Card + User Action */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        {/* VIP Upgrade Card */}
        {isVIP ? (
          <div className="p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#D4AF37] font-mono block">
                  VIP Node Active
                </span>
                <span className="text-[10px] text-white/50 font-mono block">
                  0-Min Fast Settlements
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40">
              PRO
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#181308] to-[#0A0A0C] border border-[#D4AF37]/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold text-xs font-mono">
                <Crown className="w-3.5 h-3.5" />
                <span>VIP Membership</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-black bg-[#D4AF37] px-1.5 py-0.2 rounded">
                ₹{economy.vipActivationFee}
              </span>
            </div>
            <p className="text-[11px] text-white/60 font-sans leading-tight mb-2.5">
              Unlock ₹50 min payouts & +15% rate multiplier.
            </p>
            <button
              onClick={() => handleNavClick('vip')}
              className="w-full py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-mono font-bold text-[11px] flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all"
            >
              <span>Upgrade Now</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* System Status Pill */}
        <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF87] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF87]"></span>
            </span>
            <span className="text-white/70">System Status</span>
          </div>
          <span className="text-[#00FF87] font-bold">Operational</span>
        </div>

        {/* User Auth / Logout Button */}
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>Logout ({user.name.split(' ')[0]})</span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => {
              setAuthModalTab('login');
              setAuthModalOpen(true);
              if (setMobileOpen) setMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,255,135,0.2)] transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Node</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-64 xl:w-72 flex-col fixed inset-y-0 left-0 z-30 bg-[#080B11]/95 backdrop-blur-2xl border-r border-white/10 p-4">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#080B11] border-r border-white/10 p-5 shadow-2xl overflow-y-auto animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
