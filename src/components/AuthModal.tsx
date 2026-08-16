import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Wallet,
  Gift,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    forgotPassword,
  } = useData();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('aarav.sharma@nexus.io');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUpiId, setRegUpiId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = login(loginIdentifier, loginPassword);
      if (!res.success) {
        setError(res.message);
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        upiId: regUpiId,
        referralCode: regReferralCode,
      });

      if (!res.success) {
        setError(res.message);
      }
    }, 500);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!forgotIdentifier.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      forgotPassword(forgotIdentifier);
      setOtpSent(true);
      setForgotOtp('482910'); // Auto-fill demo OTP
    }, 400);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = forgotPassword(forgotIdentifier, newPassword);
      if (res.success) {
        setOtpSent(false);
        setForgotIdentifier('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const handleQuickDemoLogin = (type: 'standard' | 'vip') => {
    if (type === 'standard') {
      setLoginIdentifier('aarav.sharma@nexus.io');
      setLoginPassword('password123');
    } else {
      setLoginIdentifier('vikram.vip@nexus.io');
      setLoginPassword('vippassword');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#0C0C0E] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,255,135,0.08)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FF87] to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setError('');
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-[#00FF87] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,135,0.4)] shrink-0">
            <Zap className="w-5 h-5 text-[#0A0A0C] stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Data Selling
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70 uppercase">
                Auth Portal
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono">
              Secure access to high-yield data monetization network
            </p>
          </div>
        </div>

        {/* Tabs: Sign In / Sign Up / Forgot Password */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0A0A0C] border border-white/10 mb-6 text-xs font-mono">
          <button
            onClick={() => {
              setAuthModalTab('login');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-center ${
              authModalTab === 'login'
                ? 'bg-[#00FF87] text-black shadow-[0_0_15px_rgba(0,255,135,0.25)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthModalTab('register');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-center ${
              authModalTab === 'register'
                ? 'bg-[#00FF87] text-black shadow-[0_0_15px_rgba(0,255,135,0.25)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Sign Up (+₹25)
          </button>
          <button
            onClick={() => {
              setAuthModalTab('forgot');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-center ${
              authModalTab === 'forgot'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. SIGN IN TAB */}
        {authModalTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-white/70">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. yourname@gmail.com or +91 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono text-white/70">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('forgot')}
                  className="text-[11px] font-mono text-[#00FF87] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white placeholder:text-white/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,135,0.3)] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Node Account...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Data Selling</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Demo Quick Login Options */}
            <div className="pt-2">
              <p className="text-[11px] font-mono text-white/40 text-center mb-2">
                Quick Fill Test Account:
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('standard')}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-[11px] font-mono transition-all"
                >
                  Standard Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('vip')}
                  className="flex-1 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-mono transition-all"
                >
                  VIP Demo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. SIGN UP TAB */}
        {authModalTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-white/70">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-white/70">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-white/70">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-white/70">
                  UPI ID (For Payouts)
                </label>
                <div className="relative">
                  <Wallet className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regUpiId}
                    onChange={(e) => setRegUpiId(e.target.value)}
                    placeholder="username@oksbi"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-[#D4AF37] flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  Referral Code (+₹25 Bonus)
                </label>
                <input
                  type="text"
                  value={regReferralCode}
                  onChange={(e) => setRegReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. LUMINA88"
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0C] border border-[#D4AF37]/30 focus:border-[#D4AF37] text-xs font-mono text-[#D4AF37] placeholder:text-[#D4AF37]/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-white/70">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-white/70">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#00FF87] text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#00FF87] hover:bg-[#20ff97] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,135,0.3)] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account & Crediting Bonus...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account & Get Welcome Bonus</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD TAB */}
        {authModalTab === 'forgot' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-white/70">
                    Enter Registered Email or Mobile
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. yourname@gmail.com or mobile"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#D4AF37] text-xs font-mono text-white placeholder:text-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Sending OTP Verification...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Send Password Reset OTP</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[#00FF87]/10 border border-[#00FF87]/30 text-[#00FF87] text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>OTP code sent to {forgotIdentifier}! Auto-verified with 482910.</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-white/70">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 text-xs font-mono text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-white/70">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#D4AF37] text-xs font-mono text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-white/70">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#D4AF37] text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Saving New Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Set New Password & Return to Login</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
