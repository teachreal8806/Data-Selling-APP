import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  History
} from 'lucide-react';
import { useData, QUICK_SELL_PACKAGES } from '../context/DataContext';
import { QuickSellPackage } from '../types';

export const QuickSellGrid: React.FC = () => {
  const { user, economy, quickSell, transactions } = useData();
  const [sellingId, setSellingId] = useState<string | null>(null);

  const isVIP = user.tier === 'vip';

  const handleSell = (pkg: QuickSellPackage) => {
    setSellingId(pkg.id);
    setTimeout(() => {
      quickSell(pkg);
      setSellingId(null);
    }, 350);
  };

  const recentSales = transactions.filter(t => t.type === 'quick_sell').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00FF87]" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Instant Quick Sell Grid
            </h3>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Monetize chunked data packets instantly without waiting. Credits applied directly to your wallet balance.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A0A0C] border border-white/10 font-mono text-xs text-white/80">
          <span className="text-white/40">Current Rate:</span>
          <span className="text-[#00FF87] font-bold">₹{economy.ratePerGB}/GB</span>
          {isVIP && <span className="text-[#D4AF37] font-bold">(+15% VIP)</span>}
        </div>
      </div>

      {/* Grid of Packages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_SELL_PACKAGES.map((pkg) => {
          let estimatedEarnings = pkg.baseReward * (1 + pkg.bonusRate);
          if (isVIP) estimatedEarnings *= economy.vipMultiplier;
          if (economy.surgeActive) estimatedEarnings *= economy.surgeMultiplier;
          estimatedEarnings = Number(estimatedEarnings.toFixed(2));

          const isSelling = sellingId === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                pkg.popular
                  ? 'bg-[#0C0C0E] border-[#00FF87]/40 shadow-[0_0_20px_rgba(0,255,135,0.08)]'
                  : 'bg-[#0C0C0E] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Package Tag */}
              {pkg.tag && (
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      pkg.popular
                        ? 'bg-[#00FF87] text-[#0A0A0C] shadow-sm'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {pkg.tag}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      pkg.popular ? 'bg-[#00FF87]/15 text-[#00FF87]' : 'bg-white/5 text-white/70'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base tracking-tight">
                      {pkg.label}
                    </h4>
                    <span className="text-[11px] font-mono text-white/40">
                      {pkg.mbAmount >= 1024 ? `${(pkg.mbAmount / 1024).toFixed(1)} GB Packet` : `${pkg.mbAmount} MB Packet`}
                    </span>
                  </div>
                </div>

                <div className="my-4 p-3 rounded-xl bg-[#0A0A0C] border border-white/5 flex items-baseline justify-between">
                  <span className="text-xs text-white/40 font-mono">Instant Payout:</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-[#00FF87] font-mono">
                      ₹{estimatedEarnings.toFixed(2)}
                    </span>
                    {pkg.bonusRate > 0 && (
                      <span className="block text-[10px] text-cyan-300 font-mono">
                        Includes +{(pkg.bonusRate * 100).toFixed(0)}% bulk bonus
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSell(pkg)}
                disabled={isSelling}
                className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                  pkg.popular
                    ? 'bg-[#00FF87] text-[#0A0A0C] hover:bg-[#20ff97] shadow-[0_0_15px_rgba(0,255,135,0.3)]'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                }`}
              >
                {isSelling ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Processing Mesh...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Sell {pkg.mbAmount >= 1024 ? `${(pkg.mbAmount / 1024)} GB` : `${pkg.mbAmount} MB`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Recent Quick Sales Ledger */}
      {recentSales.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-white/40" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Recent Quick Sell Settlements
            </h4>
          </div>
          <div className="space-y-2">
            {recentSales.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                  <div>
                    <div className="text-white font-medium">{tx.description}</div>
                    <div className="text-[10px] text-white/40 font-mono">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Completed
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#00FF87] font-mono">
                    +₹{tx.amountINR.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">Wallet Credited</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
