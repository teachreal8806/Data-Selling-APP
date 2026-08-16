import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowUpRight,
  Zap,
  Radio,
  Users,
  Crown,
  Wallet,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { TransactionRecord } from '../types';

export const TransactionsView: React.FC = () => {
  const { transactions, exportPayoutsCSV, user } = useData();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amountINR.toString().includes(searchQuery) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTxIcon = (type: TransactionRecord['type']) => {
    switch (type) {
      case 'quick_sell':
        return <Zap className="w-4 h-4 text-[#00FF87]" />;
      case 'bandwidth_share':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'referral_bonus':
        return <Users className="w-4 h-4 text-[#00FF87]" />;
      case 'vip_upgrade':
        return <Crown className="w-4 h-4 text-[#D4AF37]" />;
      case 'withdrawal':
        return <Wallet className="w-4 h-4 text-amber-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#00FF87]" />;
    }
  };

  const totalCredited = transactions
    .filter((t) => t.type !== 'withdrawal')
    .reduce((sum, t) => sum + t.amountINR, 0);

  const totalWithdrawn = transactions
    .filter((t) => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amountINR, 0);

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider block mb-1">
            Total Transactions
          </span>
          <span className="text-2xl font-bold font-mono text-white">
            {transactions.length} Records
          </span>
          <span className="text-[10px] text-white/40 font-mono block mt-1">
            Lifetime on-chain ledger
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider block mb-1">
            Total Yield Credited
          </span>
          <span className="text-2xl font-bold font-mono text-[#00FF87]">
            +₹{totalCredited.toFixed(2)}
          </span>
          <span className="text-[10px] text-[#00FF87]/70 font-mono block mt-1">
            Instant wallet credits
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider block mb-1">
            Current Wallet Balance
          </span>
          <span className="text-2xl font-bold font-mono text-white">
            ₹{user.balanceINR.toFixed(2)}
          </span>
          <span className="text-[10px] text-cyan-400 font-mono block mt-1">
            Ready for UPI settlement
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by description, amount, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 text-white placeholder-white/40 text-xs font-mono focus:border-[#00FF87] focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'quick_sell', label: 'Quick Sell' },
            { id: 'bandwidth_share', label: 'Sharing' },
            { id: 'referral_bonus', label: 'Referral' },
            { id: 'withdrawal', label: 'Withdrawals' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-[#00FF87] text-[#0A0A0C] font-bold shadow-[0_0_10px_rgba(0,255,135,0.25)]'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={exportPayoutsCSV}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all shrink-0"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl bg-[#0C0C0E] border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00FF87]" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Activity & Settlement Ledger
            </h3>
          </div>
          <span className="text-xs font-mono text-white/40">
            Showing {filteredTransactions.length} of {transactions.length}
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-xs font-mono">
            No transactions found matching your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredTransactions.map((tx) => {
              const isNegative = tx.type === 'withdrawal' || tx.type === 'vip_upgrade';
              const dateStr = new Date(tx.timestamp).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <div
                  key={tx.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                      {getTxIcon(tx.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {tx.description}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase font-bold ${
                            tx.status === 'completed'
                              ? 'bg-[#00FF87]/15 text-[#00FF87]'
                              : tx.status === 'pending'
                              ? 'bg-amber-400/15 text-amber-300'
                              : 'bg-red-500/15 text-red-300'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/40 font-mono mt-0.5 flex items-center gap-2">
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>TXID: {tx.id}</span>
                        {tx.dataMB && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-300">{tx.dataMB} MB</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono">
                    <span
                      className={`text-base font-bold ${
                        isNegative ? 'text-amber-400' : 'text-[#00FF87]'
                      }`}
                    >
                      {isNegative ? '-' : '+'}₹{tx.amountINR.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-white/40">
                      {isNegative ? 'Account Debit' : 'Wallet Credited'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
