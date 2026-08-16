export type UserTier = 'standard' | 'vip';

export type VIPStatus = 'none' | 'pending_verification' | 'active' | 'rejected';

export interface VIPSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  upiId: string;
  utrNumber: string;
  amount: number; // ₹99
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedAt?: string;
}

export interface QuickSellPackage {
  id: string;
  mbAmount: number;
  label: string;
  baseReward: number;
  bonusRate: number; // extra percentage for high tiers
  tag?: string;
  popular?: boolean;
}

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'rejected';
export type PayoutMethod = 'UPI' | 'BANK_TRANSFER' | 'PAYTM';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: PayoutMethod;
  paymentDetail: string; // UPI ID or Bank Account Details
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string;
  txnRef?: string;
  isVIPPriority: boolean;
}

export type ReferralLevel = 'bronze' | 'silver' | 'gold';

export interface ReferralMember {
  id: string;
  name: string;
  joinedDate: string;
  tierLevel: 1 | 2 | 3;
  dataSharedMB: number;
  royaltyEarnedINR: number;
  status: 'active' | 'idle';
  avatarSeed: string;
}

export interface EconomySettings {
  ratePerGB: number; // in INR (e.g. ₹50 per 1024 MB = ~₹0.0488/MB)
  vipMultiplier: number; // e.g. 1.10 (+10% extra)
  standardMinWithdrawal: number; // ₹200
  vipMinWithdrawal: number; // ₹50 (or instant)
  vipActivationFee: number; // ₹99
  tierCommissions: {
    tier1: number; // 15%
    tier2: number; // 7%
    tier3: number; // 3%
  };
  surgeMultiplier: number; // e.g. 1.5x
  surgeActive: boolean;
  surgeLabel: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'boost' | 'maintenance' | 'payout';
  active: boolean;
  createdAt: string;
}

export interface NetworkTelemetry {
  liveThroughputKBps: number;
  latencyMs: number;
  packetLossPercent: number;
  activeGlobalNodes: number;
  encryptionLevel: string;
  serverNodeLocation: string;
  assignedIP: string;
  ispName: string;
}

export interface TransactionRecord {
  id: string;
  type: 'bandwidth_share' | 'quick_sell' | 'vip_cashback' | 'referral_bonus' | 'withdrawal' | 'vip_upgrade';
  amountINR: number;
  dataMB?: number;
  timestamp: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  upiId: string;
  tier: UserTier;
  vipStatus: VIPStatus;
  vipActivatedAt?: string;
  balanceINR: number;
  lifetimeEarningsINR: number;
  totalDataSharedMB: number;
  sessionDataSharedMB: number;
  isSharing: boolean;
  referralCode: string;
  referredBy?: string;
  dailyStreak: number;
  soundEnabled: boolean;
}
