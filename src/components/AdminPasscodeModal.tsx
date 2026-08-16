import React, { useState } from 'react';
import { Shield, Lock, KeyRound, AlertTriangle, X, Eye, EyeOff } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AdminPasscodeModal: React.FC = () => {
  const {
    adminPasscodeModalOpen,
    setAdminPasscodeModalOpen,
    verifyAdminPassword,
  } = useData();

  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!adminPasscodeModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const success = verifyAdminPassword(inputPassword);
      if (!success) {
        setError('Access Denied: Invalid Security Key.');
      } else {
        setInputPassword('');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#0C0C0E] border border-[#D4AF37]/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top gold highlight glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => {
            setAdminPasscodeModalOpen(false);
            setError('');
            setInputPassword('');
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)] shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Admin Master Clearance
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37] text-black">
                PROTECTED
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Enter Super Admin Key for Governance Console
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-white/70">
              Admin Master Security Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password..."
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#0A0A0C] border border-white/10 focus:border-[#D4AF37] text-sm font-mono text-white placeholder:text-white/30 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={isVerifying || !inputPassword.trim()}
              className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#e0be47] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 transition-all disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Master Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Governance</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-mono text-white/30 text-center">
          Double-click on "Data Selling" brand logo anytime to access this gate.
        </div>
      </div>
    </div>
  );
};
