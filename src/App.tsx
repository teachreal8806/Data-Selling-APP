import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { LiveSharingController } from './components/LiveSharingController';
import { QuickSellGrid } from './components/QuickSellGrid';
import { WithdrawalProgressCard } from './components/WithdrawalProgressCard';
import { TransactionsView } from './components/TransactionsView';
import { VIPUpgradeModal } from './components/VIPUpgradeModal';
import { ReferralSystem } from './components/ReferralSystem';
import { NetworkDiagnostics } from './components/NetworkDiagnostics';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Globe,
  Zap,
  Shield
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, activeTab, announcements, toast, user } = useData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const activeAnnouncement = announcements.find((a) => a.active);

  return (
    <div className="min-h-screen flex bg-[#080B11] text-[#E2E8F0] selection:bg-[#00FF87]/20 selection:text-[#00FF87]">
      {/* 1. Left Fixed Sidebar & Mobile Drawer */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* 2. Main Layout Area (offset for desktop sidebar) */}
      <div className="flex-1 flex flex-col md:pl-64 xl:pl-72 min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar onToggleMobileMenu={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
          {/* PWA Prompt Banner */}
          <PWAInstallBanner />

          {/* Global Broadcast Announcement */}
          {activeAnnouncement && (
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs animate-fade-in ${
                activeAnnouncement.type === 'boost'
                  ? 'bg-[#181308]/80 border-[#D4AF37]/40 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                  : 'bg-[#061710]/80 border-[#00FF87]/30 text-[#00FF87] shadow-[0_0_20px_rgba(0,255,135,0.08)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 shrink-0" />
                <div>
                  <strong className="font-semibold">{activeAnnouncement.title}</strong>
                  <span className="hidden sm:inline text-white/80 ml-2 font-mono">
                    {activeAnnouncement.message}
                  </span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 shrink-0 font-bold">
                Live Broadcast
              </span>
            </div>
          )}

          {/* View Switcher: User Dashboard vs Super Admin Governance Panel */}
          {activeView === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="space-y-6">
              {/* Tab Views */}
              {(activeTab === 'dashboard' || !activeTab) && <ProfessionalDashboard />}
              {activeTab === 'refinery' && <LiveSharingController />}
              {activeTab === 'quicksell' && <QuickSellGrid />}
              {(activeTab === 'payouts' || activeTab === 'wallet') && <WithdrawalProgressCard />}
              {(activeTab === 'history' || activeTab === 'transactions') && <TransactionsView />}
              {activeTab === 'vip' && <VIPUpgradeModal />}
              {activeTab === 'referrals' && <ReferralSystem />}
              {activeTab === 'diagnostics' && <NetworkDiagnostics />}
            </div>
          )}
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-white/5 bg-[#080B11] py-6 text-center text-xs text-white/40 font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
              <span className="text-white/60 font-semibold">DATA SELLING AUTONOMOUS ECOSYSTEM V3.0</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#00FF87]" /> BANK-GRADE 256-BIT ENCRYPTION
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#D4AF37]" /> 24/7 INSTANT UPI GATEWAY
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-400" /> MUMBAI EDGE CLUSTER #04
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* AI Advisor Modal */}
      <AIAdvisorModal />

      {/* User Profile / Settings Modal */}
      <UserProfileModal />

      {/* Authentication Modal (Sign In / Sign Up / Forgot Password) */}
      <AuthModal />

      {/* Super Admin Passcode Security Gate Modal */}
      <AdminPasscodeModal />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div
            className={`px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-center gap-2.5 text-xs font-mono max-w-sm ${
              toast.type === 'gold'
                ? 'bg-[#181308]/95 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                : toast.type === 'error'
                ? 'bg-[#1c0c0e]/95 border-red-500 text-red-200 shadow-red-500/20'
                : toast.type === 'info'
                ? 'bg-[#0a1524]/95 border-cyan-400 text-cyan-200 shadow-cyan-500/20'
                : 'bg-[#081812]/95 border-[#00FF87] text-[#00FF87] shadow-[0_0_25px_rgba(0,255,135,0.25)]'
            }`}
          >
            {toast.type === 'gold' ? (
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
}
