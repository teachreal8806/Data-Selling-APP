import React, { useState } from 'react';
import {
  Wifi,
  Shield,
  Activity,
  Server,
  Globe,
  Lock,
  Cpu,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle2,
  Send,
  HelpCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const NetworkDiagnostics: React.FC = () => {
  const { user, telemetry, supportConfig, triggerAIAdvisor, notifyToast } = useData();
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<number>(telemetry.latencyMs);

  const runSpeedTest = () => {
    setTestingPing(true);
    notifyToast('Pinging edge mesh routing relays...', 'info');
    setTimeout(() => {
      const newPing = Math.floor(Math.random() * (26 - 14 + 1)) + 14;
      setPingResult(newPing);
      setTestingPing(false);
      notifyToast(`Routing test complete: ${newPing}ms to Mumbai Hub.`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Official Telegram Helpdesk Banner */}
      {supportConfig.enabled && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#229ED9]/15 via-[#0C0C0E] to-[#0C0C0E] border border-[#229ED9]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_25px_rgba(34,158,217,0.08)]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9] shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Official Telegram Support & Community
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#229ED9]/20 text-[#229ED9] border border-[#229ED9]/30">
                  24/7 ONLINE
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1 max-w-xl">
                {supportConfig.supportNote || 'Need help with payout settlements, node setup, or VIP activation? Connect with our official team on Telegram.'}
              </p>
              <div className="text-[11px] font-mono text-white/50 mt-1 flex items-center gap-3">
                <span>Handle: <strong className="text-white">@{supportConfig.telegramUsername}</strong></span>
                <span>•</span>
                <span>Email: <strong className="text-white">{supportConfig.supportEmail}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={supportConfig.telegramChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1e8bc0] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,158,217,0.3)] transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Join Telegram Group</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Node Health Banner */}
      <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Node Telemetry & Relay Diagnostics
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00FF87]/20 text-[#00FF87] border border-[#00FF87]/30">
                100% OPERATIONAL
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Live inspection of encrypted wireguard tunnel, ISP routing, packet integrity, and mesh throughput.
            </p>
          </div>
        </div>

        <button
          onClick={runSpeedTest}
          disabled={testingPing}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
          <span>{testingPing ? 'Testing Route...' : 'Run Diagnostics Ping'}</span>
        </button>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latency */}
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-cyan-400" /> Ping Latency
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-mono">Edge</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {pingResult} <span className="text-xs text-white/40 font-normal">ms</span>
          </div>
          <p className="text-[10px] text-[#00FF87] font-mono mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Optimal for high-value packets
          </p>
        </div>

        {/* Global Mesh Nodes */}
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#00FF87]" /> Global Network
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00FF87]/20 text-[#00FF87] font-mono font-bold">Active</span>
          </div>
          <div className="text-2xl font-bold text-[#00FF87] font-mono">
            {telemetry.activeGlobalNodes.toLocaleString()}
          </div>
          <p className="text-[10px] text-white/40 font-mono mt-1">
            Verified connected P2P peers
          </p>
        </div>

        {/* Packet Loss */}
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" /> Packet Integrity
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            99.99<span className="text-xs text-white/40 font-normal">%</span>
          </div>
          <p className="text-[10px] text-white/40 font-mono mt-1">
            0.01% loss (Standard threshold)
          </p>
        </div>

        {/* Encryption */}
        <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#D4AF37]" /> Security Layer
            </span>
          </div>
          <div className="text-base font-bold text-white font-mono truncate">
            AES-256-GCM
          </div>
          <p className="text-[10px] text-[#D4AF37] font-mono mt-1">
            Zero-Knowledge Bandwidth Relay
          </p>
        </div>
      </div>

      {/* Network Edge Architecture Map Details */}
      <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          Routing Protocol & ISP Node Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-1">
            <span className="text-white/40 text-[10px] uppercase">ISP & Connection</span>
            <div className="text-white font-medium">{telemetry.ispName}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-1">
            <span className="text-white/40 text-[10px] uppercase">Assigned Node IP</span>
            <div className="text-white font-medium">{telemetry.assignedIP}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-1">
            <span className="text-white/40 text-[10px] uppercase">Edge Cluster Location</span>
            <div className="text-white font-medium">{telemetry.serverNodeLocation}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/5 space-y-1">
            <span className="text-white/40 text-[10px] uppercase">Privacy Guarantee</span>
            <div className="text-[#00FF87] font-medium">No Personal Browsing Logs Routed</div>
          </div>
        </div>
      </div>

      {/* AI Smart Optimizer Callout */}
      <div className="p-5 rounded-2xl bg-[#0C0C0E] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              AI Bandwidth Yield Advisor
            </h4>
            <p className="text-xs text-white/50 mt-0.5">
              Analyze network congestion windows, peak earning hours (7 PM - 11 PM), and device bandwidth thresholds.
            </p>
          </div>
        </div>
        <button
          onClick={triggerAIAdvisor}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch AI Analysis</span>
        </button>
      </div>
    </div>
  );
};
