import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { NavigationTabs } from './components/NavigationTabs';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { LiveSharingController } from './components/LiveSharingController';
import { QuickSellGrid } from './components/QuickSellGrid';
import { WithdrawalProgressCard } from './components/WithdrawalProgressCard';
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
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, activeTab, announcements, toast, user } = useData();

  const isVIP = user.tier === 'vip';
  const activeAnnouncement = announcements.find((a) => a.active);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-[#E2E8F0] cyber-grid pb-24 md:pb-12">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* PWA Prompt */}
        <PWAInstallBanner />

        {/* Global Broadcast Banner */}
        {activeAnnouncement && (
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs animate-fade-in ${
              activeAnnouncement.type === 'boost'
                ? 'bg-[#181308]/60 border-[#D4AF37]/40 text-[#D4AF37]'
                : 'bg-[#061710]/60 border-[#00FF87]/30 text-[#00FF87]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 shrink-0" />
              <div>
                <strong className="font-['Space_Grotesk']">{activeAnnouncement.title}</strong>
                <span className="hidden sm:inline text-white/80 ml-2 font-mono">
                  {activeAnnouncement.message}
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 shrink-0">
              Live Network Notice
            </span>
          </div>
        )}

        {/* View Switcher: User App vs Admin Dashboard */}
        {activeView === 'admin' ? (
          <AdminDashboard />
        ) : (
          <div className="space-y-5">
            {/* User Navigation Tabs */}
            <NavigationTabs />

            {/* Tab Views */}
            {(activeTab === 'dashboard' || !activeTab) && <ProfessionalDashboard />}
            {activeTab === 'refinery' && <LiveSharingController />}
            {activeTab === 'quicksell' && <QuickSellGrid />}
            {(activeTab === 'payouts' || activeTab === 'wallet') && <WithdrawalProgressCard />}
            {activeTab === 'vip' && <VIPUpgradeModal />}
            {activeTab === 'referrals' && <ReferralSystem />}
            {activeTab === 'diagnostics' && <NetworkDiagnostics />}
          </div>
        )}
      </main>

      {/* AI Advisor Modal */}
      <AIAdvisorModal />

      {/* User Profile Modal */}
      <UserProfileModal />

      {/* Authentication Modal (Sign In / Sign Up / Forgot Password) */}
      <AuthModal />

      {/* Admin Passcode Modal (Password: ADMINPANELDEEPAKSQW) */}
      <AdminPasscodeModal />

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 animate-slide-up">
          <div
            className={`px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs font-mono max-w-sm ${
              toast.type === 'gold'
                ? 'bg-[#181308]/95 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                : toast.type === 'error'
                ? 'bg-[#1c0c0e]/95 border-red-500 text-red-200 shadow-red-500/20'
                : toast.type === 'info'
                ? 'bg-[#0a1524]/95 border-cyan-400 text-cyan-200 shadow-cyan-500/20'
                : 'bg-[#081812]/95 border-[#00FF87] text-[#00FF87] shadow-[0_0_20px_rgba(0,255,135,0.2)]'
            }`}
          >
            {toast.type === 'gold' ? (
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 bg-[#0A0A0C] py-6 text-center text-xs text-white/40 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
}
