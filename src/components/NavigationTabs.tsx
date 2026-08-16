import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Zap,
  Crown,
  Users,
  Wallet,
  Activity
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, user } = useData();
  const isVIP = user.tier === 'vip';

  const tabs = [
    { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard, badge: user.isSharing ? 'LIVE' : undefined },
    { id: 'refinery', label: 'Live Mesh', icon: Radio },
    { id: 'quicksell', label: 'Quick Sell', icon: Zap, highlight: true },
    { id: 'wallet', label: 'Withdrawal', icon: Wallet },
    { id: 'vip', label: 'VIP Mode', icon: Crown, vipStyle: true, badge: isVIP ? 'PRO' : '₹99' },
    { id: 'referrals', label: '3-Tier Referrals', icon: Users },
    { id: 'diagnostics', label: 'Network Health', icon: Activity },
  ];

  return (
    <div className="w-full">
      {/* Desktop / Tablet Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (activeTab === 'payouts' && tab.id === 'wallet');

          let activeClass = 'bg-[#00FF87] text-[#0A0A0C] font-bold shadow-[0_0_15px_rgba(0,255,135,0.3)]';
          if (tab.vipStyle) {
            activeClass = 'bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.35)]';
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? activeClass
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.vipStyle && !isActive ? 'text-[#D4AF37]' : ''}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-black/20 text-black'
                      : tab.badge === 'LIVE'
                      ? 'bg-[#00FF87]/20 text-[#00FF87] animate-pulse'
                      : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Bottom Fixed Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex justify-around items-center">
        {tabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (activeTab === 'payouts' && tab.id === 'wallet');

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all relative ${
                isActive
                  ? tab.vipStyle
                    ? 'text-[#D4AF37]'
                    : 'text-[#00FF87]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive
                    ? tab.vipStyle
                      ? 'bg-[#D4AF37]/20'
                      : 'bg-[#00FF87]/20'
                    : 'bg-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-medium">
                {tab.id === 'dashboard' ? 'Home' : tab.id === 'refinery' ? 'Mesh' : tab.id === 'quicksell' ? 'Quick Sell' : tab.id === 'wallet' ? 'Payout' : 'VIP'}
              </span>
              {tab.badge === 'LIVE' && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#00FF87] animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
