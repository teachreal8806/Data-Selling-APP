import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  EconomySettings,
  VIPSubmission,
  WithdrawalRequest,
  ReferralMember,
  TransactionRecord,
  SystemAnnouncement,
  NetworkTelemetry,
  QuickSellPackage,
  PayoutStatus,
  PayoutMethod,
  PaymentGatewayConfig,
  SupportConfig
} from '../types';
import { soundEngine } from '../utils/audio';

export const QUICK_SELL_PACKAGES: QuickSellPackage[] = [
  { id: 'qs-10mb', mbAmount: 10, label: '10 MB Spark', baseReward: 0.55, bonusRate: 0, tag: 'Starter' },
  { id: 'qs-50mb', mbAmount: 50, label: '50 MB Pulse', baseReward: 2.85, bonusRate: 0.02, tag: 'Fast' },
  { id: 'qs-250mb', mbAmount: 250, label: '250 MB Core', baseReward: 14.50, bonusRate: 0.05, popular: true, tag: 'Most Popular' },
  { id: 'qs-500mb', mbAmount: 500, label: '500 MB Hyper', baseReward: 30.00, bonusRate: 0.08, tag: 'Value Pack' },
  { id: 'qs-1gb', mbAmount: 1024, label: '1.0 GB Prime', baseReward: 65.00, bonusRate: 0.12, tag: '+12% Bonus' },
  { id: 'qs-2gb', mbAmount: 2048, label: '2.0 GB Ultra Quantum', baseReward: 138.00, bonusRate: 0.18, tag: '+18% VIP Max' },
];

const INITIAL_ECONOMY: EconomySettings = {
  ratePerGB: 52.00, // ~ ₹0.0507 / MB
  vipMultiplier: 1.15, // +15% yield bonus for VIP
  standardMinWithdrawal: 200,
  vipMinWithdrawal: 50,
  vipActivationFee: 99,
  tierCommissions: {
    tier1: 15,
    tier2: 7,
    tier3: 3,
  },
  surgeMultiplier: 1.5,
  surgeActive: false,
  surgeLabel: '🔥 1.5x Peak Hour Surge Active',
};

export const INITIAL_PAYMENT_CONFIG: PaymentGatewayConfig = {
  officialUpiId: 'dataselling.pay@axisbank',
  officialPayeeName: 'DataSelling Secure Mesh Protocol',
  customQrUrl: '',
  activationFee: 99,
  requirePaymentBeforeWithdrawal: true,
  activationNote: 'One-time node authentication & instant payout verification fee',
};

export const INITIAL_SUPPORT_CONFIG: SupportConfig = {
  telegramUsername: 'DataSellingOfficial',
  telegramChannelUrl: 'https://t.me/dataselling_official_node',
  supportEmail: 'support@dataselling.io',
  supportPhone: '+91 98765 43210',
  whatsappNumber: '+91 98765 43210',
  operatingHours: '24/7 Live Support & Telegram Priority Desk',
  isLiveSupportOnline: true,
};

const INITIAL_USER: UserProfile = {
  id: 'usr-lumina-902',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@nexus.io',
  phone: '+91 98765 43210',
  upiId: 'aarav99@oksbi',
  tier: 'standard',
  vipStatus: 'none',
  balanceINR: 84.50,
  lifetimeEarningsINR: 342.20,
  totalDataSharedMB: 6840,
  sessionDataSharedMB: 0,
  isSharing: false,
  referralCode: 'LUMINA88',
  dailyStreak: 6,
  soundEnabled: true,
};

const INITIAL_VIP_SUBMISSIONS: VIPSubmission[] = [
  {
    id: 'vip-sub-101',
    userId: 'usr-dev-041',
    userName: 'Rohan Verma',
    userEmail: 'rohan.v@gmail.com',
    upiId: 'rohan@paytm',
    utrNumber: '423984102948',
    amount: 99,
    submittedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    status: 'pending',
  },
  {
    id: 'vip-sub-102',
    userId: 'usr-dev-082',
    userName: 'Priya Sundaram',
    userEmail: 'priya.s@outlook.com',
    upiId: 'priya.nexus@okhdfcbank',
    utrNumber: '423987651034',
    amount: 99,
    submittedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'pending',
  },
  {
    id: 'vip-sub-103',
    userId: 'usr-dev-019',
    userName: 'Ananya Gupta',
    userEmail: 'ananya.g@tech.in',
    upiId: 'ananyag@axl',
    utrNumber: '423910293847',
    amount: 99,
    submittedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'approved',
    reviewedAt: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
  }
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wd-901',
    userId: 'usr-lumina-902',
    userName: 'Aarav Sharma',
    amount: 250,
    method: 'UPI',
    paymentDetail: 'aarav99@oksbi',
    status: 'paid',
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    txnRef: 'UPI/42381920391/CR',
    isVIPPriority: false,
  },
  {
    id: 'wd-902',
    userId: 'usr-vip-334',
    userName: 'Vikram Malhotra',
    amount: 540,
    method: 'UPI',
    paymentDetail: 'vikram.m@ybl',
    status: 'processing',
    requestedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isVIPPriority: true,
  },
  {
    id: 'wd-903',
    userId: 'usr-node-771',
    userName: 'Tanvi Deshmukh',
    amount: 210,
    method: 'UPI',
    paymentDetail: 'tanvi@icici',
    status: 'pending',
    requestedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isVIPPriority: false,
  },
  {
    id: 'wd-904',
    userId: 'usr-node-882',
    userName: 'Kabir Singhania',
    amount: 1200,
    method: 'BANK_TRANSFER',
    paymentDetail: 'A/C: 5010023910294, IFSC: HDFC0001092',
    status: 'pending',
    requestedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isVIPPriority: true,
  }
];

const INITIAL_REFERRALS: ReferralMember[] = [
  { id: 'ref-1', name: 'Vikramaditya S.', joinedDate: 'Yesterday', tierLevel: 1, dataSharedMB: 4850, royaltyEarnedINR: 36.40, status: 'active', avatarSeed: 'Vikram' },
  { id: 'ref-2', name: 'Sneha Patel', joinedDate: '3 days ago', tierLevel: 1, dataSharedMB: 3120, royaltyEarnedINR: 23.40, status: 'active', avatarSeed: 'Sneha' },
  { id: 'ref-3', name: 'Ritesh Kumar', joinedDate: '5 days ago', tierLevel: 2, dataSharedMB: 1840, royaltyEarnedINR: 6.80, status: 'active', avatarSeed: 'Ritesh' },
  { id: 'ref-4', name: 'Meera Iyer', joinedDate: '1 week ago', tierLevel: 2, dataSharedMB: 920, royaltyEarnedINR: 3.40, status: 'idle', avatarSeed: 'Meera' },
  { id: 'ref-5', name: 'Arjun Das', joinedDate: '2 weeks ago', tierLevel: 3, dataSharedMB: 540, royaltyEarnedINR: 0.85, status: 'idle', avatarSeed: 'Arjun' },
];

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-1',
    type: 'quick_sell',
    amountINR: 14.50,
    dataMB: 250,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    description: 'Instant Bandwidth Sell (250 MB Core)',
    status: 'completed'
  },
  {
    id: 'tx-2',
    type: 'referral_bonus',
    amountINR: 25.00,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    description: 'Level 1 Network Expansion Milestone',
    status: 'completed'
  },
  {
    id: 'tx-3',
    type: 'bandwidth_share',
    amountINR: 45.00,
    dataMB: 900,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    description: 'Autonomous P2P Data Mesh Yield',
    status: 'completed'
  },
];

const INITIAL_ANNOUNCEMENTS: SystemAnnouncement[] = [
  {
    id: 'ann-1',
    title: '⚡ Lumina Protocol V2.4 Activated',
    message: 'Global node bandwidth throughput optimization complete. Payout settlements processed 24/7.',
    type: 'info',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ann-2',
    title: '👑 VIP Instant UPI Mode',
    message: 'VIP Nodes enjoy 0-minute UPI auto-settlements + 15% rate multiplier on every shared megabyte.',
    type: 'boost',
    active: true,
    createdAt: new Date().toISOString()
  }
];

export const ADMIN_MASTER_KEY = 'ADMINPANELDEEPAKSQW';

interface DataContextType {
  user: UserProfile;
  economy: EconomySettings;
  paymentConfig: PaymentGatewayConfig;
  supportConfig: SupportConfig;
  vipSubmissions: VIPSubmission[];
  withdrawals: WithdrawalRequest[];
  referrals: ReferralMember[];
  transactions: TransactionRecord[];
  announcements: SystemAnnouncement[];
  telemetry: NetworkTelemetry;
  historyPoints: { time: string; mbps: number; rateINR: number }[];
  activeView: 'user' | 'admin';
  activeTab: string;
  setActiveView: (view: 'user' | 'admin') => void;
  setActiveTab: (tab: string) => void;
  toggleDataSharing: () => void;
  quickSell: (pkg: QuickSellPackage) => boolean;
  submitVIPPayment: (data: { upiId: string; utrNumber: string }) => boolean;
  submitActivationPayment: (data: { upiId: string; utrNumber: string }) => boolean;
  requestWithdrawal: (amount: number, method: PayoutMethod, paymentDetail: string) => { success: boolean; message: string; requirePayment?: boolean };
  adminApproveVIP: (submissionId: string) => void;
  adminRejectVIP: (submissionId: string, reason: string) => void;
  adminUpdatePayoutStatus: (withdrawalId: string, status: PayoutStatus, txnRef?: string) => void;
  adminBatchApprovePayouts: (withdrawalIds: string[]) => void;
  adminUpdateEconomy: (newSettings: Partial<EconomySettings>) => void;
  adminUpdatePaymentConfig: (newSettings: Partial<PaymentGatewayConfig>) => void;
  adminUpdateSupportConfig: (newSettings: Partial<SupportConfig>) => void;
  adminAddAnnouncement: (item: Omit<SystemAnnouncement, 'id' | 'createdAt'>) => void;
  adminToggleAnnouncement: (id: string) => void;
  adminDeleteAnnouncement: (id: string) => void;
  exportPayoutsCSV: () => void;
  toggleSound: () => void;
  triggerAIAdvisor: () => void;
  showAIModal: boolean;
  setShowAIModal: (show: boolean) => void;
  notifyToast: (message: string, type?: 'success' | 'info' | 'error' | 'gold') => void;
  toast: { message: string; type: 'success' | 'info' | 'error' | 'gold' } | null;
  selectedWithdrawalDetail: WithdrawalRequest | null;
  setSelectedWithdrawalDetail: (wd: WithdrawalRequest | null) => void;
  // Auth state & methods
  isAuthenticated: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalTab: (tab: 'login' | 'register' | 'forgot') => void;
  userProfileModalOpen: boolean;
  setUserProfileModalOpen: (open: boolean) => void;
  login: (emailOrPhone: string, password: string) => { success: boolean; message: string };
  register: (data: { name: string; email: string; phone: string; password: string; upiId?: string; referralCode?: string }) => { success: boolean; message: string };
  forgotPassword: (emailOrPhone: string, newPassword?: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  // Admin passcode methods
  adminPasscodeModalOpen: boolean;
  setAdminPasscodeModalOpen: (open: boolean) => void;
  isAdminUnlocked: boolean;
  verifyAdminPassword: (password: string) => boolean;
  lockAdminPanel: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('dataselling_user') || localStorage.getItem('datarefine_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const auth = localStorage.getItem('dataselling_is_auth');
      return auth !== null ? JSON.parse(auth) : true;
    } catch {
      return true;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [userProfileModalOpen, setUserProfileModalOpen] = useState<boolean>(false);
  
  // Admin lock state
  const [adminPasscodeModalOpen, setAdminPasscodeModalOpen] = useState<boolean>(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);

  const [economy, setEconomy] = useState<EconomySettings>(() => {
    try {
      const saved = localStorage.getItem('dataselling_economy') || localStorage.getItem('datarefine_economy');
      return saved ? JSON.parse(saved) : INITIAL_ECONOMY;
    } catch {
      return INITIAL_ECONOMY;
    }
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>(() => {
    try {
      const saved = localStorage.getItem('dataselling_payment_config');
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT_CONFIG;
    } catch {
      return INITIAL_PAYMENT_CONFIG;
    }
  });

  const [supportConfig, setSupportConfig] = useState<SupportConfig>(() => {
    try {
      const saved = localStorage.getItem('dataselling_support_config');
      return saved ? JSON.parse(saved) : INITIAL_SUPPORT_CONFIG;
    } catch {
      return INITIAL_SUPPORT_CONFIG;
    }
  });

  const [selectedWithdrawalDetail, setSelectedWithdrawalDetail] = useState<WithdrawalRequest | null>(null);

  const [vipSubmissions, setVipSubmissions] = useState<VIPSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('dataselling_vip_subs') || localStorage.getItem('datarefine_vip_subs');
      return saved ? JSON.parse(saved) : INITIAL_VIP_SUBMISSIONS;
    } catch {
      return INITIAL_VIP_SUBMISSIONS;
    }
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    try {
      const saved = localStorage.getItem('dataselling_withdrawals') || localStorage.getItem('datarefine_withdrawals');
      return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
    } catch {
      return INITIAL_WITHDRAWALS;
    }
  });

  const [referrals, setReferrals] = useState<ReferralMember[]>(() => {
    try {
      const saved = localStorage.getItem('dataselling_referrals') || localStorage.getItem('datarefine_referrals');
      return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
    } catch {
      return INITIAL_REFERRALS;
    }
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('dataselling_transactions') || localStorage.getItem('datarefine_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('dataselling_announcements') || localStorage.getItem('datarefine_announcements');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [activeView, setActiveView] = useState<'user' | 'admin'>('user');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' | 'gold' } | null>(null);

  const [telemetry, setTelemetry] = useState<NetworkTelemetry>({
    liveThroughputKBps: 0,
    latencyMs: 19,
    packetLossPercent: 0.01,
    activeGlobalNodes: 14289,
    encryptionLevel: 'AES-256-GCM / WireGuard P2P',
    serverNodeLocation: 'Mumbai Edge Cluster #04 (IN-WEST)',
    assignedIP: '157.240.198.35',
    ispName: 'Jio 5G Fiber Ultra Mesh',
  });

  const [historyPoints, setHistoryPoints] = useState<{ time: string; mbps: number; rateINR: number }[]>([
    { time: '10:00', mbps: 2.1, rateINR: 0.11 },
    { time: '10:15', mbps: 3.4, rateINR: 0.17 },
    { time: '10:30', mbps: 4.8, rateINR: 0.25 },
    { time: '10:45', mbps: 3.9, rateINR: 0.20 },
    { time: '11:00', mbps: 5.2, rateINR: 0.28 },
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dataselling_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('dataselling_is_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('dataselling_economy', JSON.stringify(economy));
  }, [economy]);

  useEffect(() => {
    localStorage.setItem('dataselling_vip_subs', JSON.stringify(vipSubmissions));
  }, [vipSubmissions]);

  useEffect(() => {
    localStorage.setItem('dataselling_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('dataselling_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dataselling_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const notifyToast = useCallback((message: string, type: 'success' | 'info' | 'error' | 'gold' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  const toggleSound = useCallback(() => {
    setUser(prev => {
      const next = !prev.soundEnabled;
      soundEngine.setEnabled(next);
      return { ...prev, soundEnabled: next };
    });
  }, []);

  // Real-time sharing simulator loop
  const isSharingRef = useRef(user.isSharing);
  isSharingRef.current = user.isSharing;

  useEffect(() => {
    if (!user.isSharing) {
      setTelemetry(prev => ({ ...prev, liveThroughputKBps: 0 }));
      return;
    }

    const interval = setInterval(() => {
      if (!isSharingRef.current) return;

      // Throughput varies between 1.5 MB/s and 6.8 MB/s (in KBps: 1500 - 6800)
      const baseThroughputKBps = Math.floor(Math.random() * (6400 - 2200 + 1)) + 2200;
      const isVIP = user.tier === 'vip';
      const effectiveKBps = isVIP ? baseThroughputKBps * 1.25 : baseThroughputKBps;
      const deltaMB = (effectiveKBps / 1024) * 0.5; // per 500ms

      // Rate calculations
      const ratePerMB = (economy.ratePerGB / 1024);
      let earnedINR = deltaMB * ratePerMB;
      if (isVIP) earnedINR *= economy.vipMultiplier;
      if (economy.surgeActive) earnedINR *= economy.surgeMultiplier;

      setUser(prev => ({
        ...prev,
        balanceINR: Number((prev.balanceINR + earnedINR).toFixed(3)),
        lifetimeEarningsINR: Number((prev.lifetimeEarningsINR + earnedINR).toFixed(3)),
        totalDataSharedMB: Number((prev.totalDataSharedMB + deltaMB).toFixed(2)),
        sessionDataSharedMB: Number((prev.sessionDataSharedMB + deltaMB).toFixed(2)),
      }));

      setTelemetry(prev => ({
        ...prev,
        liveThroughputKBps: Math.round(effectiveKBps),
        latencyMs: Math.max(12, Math.min(38, Math.round(prev.latencyMs + (Math.random() * 4 - 2)))),
        activeGlobalNodes: prev.activeGlobalNodes + (Math.random() > 0.6 ? 1 : 0),
      }));

      // History updates periodically
      if (Math.random() > 0.85) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        setHistoryPoints(prev => {
          const next = [...prev.slice(-14), {
            time: timeStr,
            mbps: Number((effectiveKBps / 1024).toFixed(2)),
            rateINR: Number((earnedINR * 10).toFixed(2))
          }];
          return next;
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [user.isSharing, user.tier, economy]);

  const toggleDataSharing = useCallback(() => {
    setUser(prev => {
      const nextState = !prev.isSharing;
      soundEngine.playToggle(nextState);
      if (nextState) {
        notifyToast('⚡ Lumina Mesh Node Connected. Bandwidth Monetization Active.', 'success');
      } else {
        notifyToast('Node Paused. Session data safely locked.', 'info');
      }
      return { ...prev, isSharing: nextState };
    });
  }, [notifyToast]);

  const quickSell = useCallback((pkg: QuickSellPackage) => {
    soundEngine.playCashSound();
    const isVIP = user.tier === 'vip';
    let reward = pkg.baseReward * (1 + pkg.bonusRate);
    if (isVIP) reward *= economy.vipMultiplier;
    if (economy.surgeActive) reward *= economy.surgeMultiplier;
    reward = Number(reward.toFixed(2));

    setUser(prev => ({
      ...prev,
      balanceINR: Number((prev.balanceINR + reward).toFixed(2)),
      lifetimeEarningsINR: Number((prev.lifetimeEarningsINR + reward).toFixed(2)),
      totalDataSharedMB: prev.totalDataSharedMB + pkg.mbAmount,
    }));

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'quick_sell',
      amountINR: reward,
      dataMB: pkg.mbAmount,
      timestamp: new Date().toISOString(),
      description: `Instant Sale (${pkg.label})`,
      status: 'completed',
    };

    setTransactions(prev => [newTx, ...prev]);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: isVIP ? ['#FFD700', '#FFA500', '#00FF87'] : ['#00FF87', '#06B6D4', '#FFFFFF'],
    });

    notifyToast(`₹${reward.toFixed(2)} credited instantly for ${pkg.mbAmount} MB!`, isVIP ? 'gold' : 'success');
    return true;
  }, [user.tier, economy, notifyToast]);

  const submitVIPPayment = useCallback((data: { upiId: string; utrNumber: string }) => {
    if (!data.utrNumber || data.utrNumber.length < 8) {
      notifyToast('Please enter a valid 12-digit UTR transaction reference number.', 'error');
      return false;
    }

    soundEngine.playClick();

    const newSubmission: VIPSubmission = {
      id: `vip-sub-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      upiId: data.upiId || user.upiId,
      utrNumber: data.utrNumber.trim(),
      amount: economy.vipActivationFee,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    setVipSubmissions(prev => [newSubmission, ...prev]);

    setUser(prev => ({
      ...prev,
      hasPaidActivation: true,
      vipStatus: 'pending_verification',
      upiId: data.upiId || prev.upiId
    }));

    notifyToast('🎉 UTR reference submitted! Admin verification takes 5-15 mins.', 'gold');
    return true;
  }, [user, economy.vipActivationFee, notifyToast]);

  const submitActivationPayment = useCallback((data: { upiId: string; utrNumber: string }) => {
    if (!data.utrNumber || data.utrNumber.length < 8) {
      notifyToast('Please enter a valid 12-digit UTR transaction reference number.', 'error');
      return false;
    }

    soundEngine.playClick();

    const newSubmission: VIPSubmission = {
      id: `act-sub-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      upiId: data.upiId || user.upiId,
      utrNumber: data.utrNumber.trim(),
      amount: paymentConfig.activationFee,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    setVipSubmissions(prev => [newSubmission, ...prev]);

    setUser(prev => ({
      ...prev,
      hasPaidActivation: true,
      vipStatus: 'pending_verification',
      upiId: data.upiId || prev.upiId
    }));

    notifyToast('🎉 Node verification UTR submitted! Payout channel is being authorized.', 'gold');
    return true;
  }, [user, paymentConfig.activationFee, notifyToast]);

  const requestWithdrawal = useCallback((amount: number, method: PayoutMethod, paymentDetail: string) => {
    const isVIP = user.tier === 'vip';
    const isActivationPaid = Boolean(user.hasPaidActivation || user.vipStatus === 'active' || user.tier === 'vip');

    if (paymentConfig.requirePaymentBeforeWithdrawal && !isActivationPaid) {
      notifyToast(`⚠️ Activation verification required before withdrawal. Please complete one-time node authentication (₹${paymentConfig.activationFee}).`, 'gold');
      return { success: false, message: 'Activation verification payment required.', requirePayment: true };
    }

    const minRequired = isVIP ? economy.vipMinWithdrawal : economy.standardMinWithdrawal;

    if (amount < minRequired) {
      notifyToast(`Minimum withdrawal is ₹${minRequired} (${isVIP ? 'VIP Threshold' : 'Standard Threshold'}).`, 'error');
      return { success: false, message: `Minimum withdrawal is ₹${minRequired}.` };
    }

    if (amount > user.balanceINR) {
      notifyToast('Insufficient balance for this withdrawal request.', 'error');
      return { success: false, message: 'Insufficient balance.' };
    }

    if (!paymentDetail || paymentDetail.trim().length < 5) {
      notifyToast('Please enter a valid UPI ID or Bank Details.', 'error');
      return { success: false, message: 'Invalid payment destination details.' };
    }

    soundEngine.playCashSound();

    const newWd: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      amount,
      method,
      paymentDetail: paymentDetail.trim(),
      status: isVIP ? 'processing' : 'pending',
      requestedAt: new Date().toISOString(),
      isVIPPriority: isVIP,
    };

    setWithdrawals(prev => [newWd, ...prev]);

    setUser(prev => ({
      ...prev,
      balanceINR: Number((prev.balanceINR - amount).toFixed(2)),
    }));

    const tx: TransactionRecord = {
      id: `tx-wd-${Date.now()}`,
      type: 'withdrawal',
      amountINR: -amount,
      timestamp: new Date().toISOString(),
      description: `Withdrawal to ${paymentDetail.substring(0, 16)} (${method})`,
      status: 'pending'
    };

    setTransactions(prev => [tx, ...prev]);

    notifyToast(`₹${amount} withdrawal requested! ${isVIP ? 'VIP Instant Queue priority.' : 'Standard 24-hr batch cycle.'}`, isVIP ? 'gold' : 'success');
    return { success: true, message: 'Withdrawal successfully queued.' };
  }, [user, economy, paymentConfig, notifyToast]);

  // Admin Actions
  const adminApproveVIP = useCallback((submissionId: string) => {
    soundEngine.playVIPUnlock();

    setVipSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          status: 'approved',
          reviewedAt: new Date().toISOString()
        };
      }
      return s;
    }));

    // If matches current user, instantly upgrade to VIP!
    const sub = vipSubmissions.find(s => s.id === submissionId);
    if (sub && (sub.userId === user.id || sub.userName === user.name)) {
      setUser(prev => ({
        ...prev,
        tier: 'vip',
        vipStatus: 'active',
        vipActivatedAt: new Date().toISOString(),
      }));

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#00FF87', '#FFFFFF']
      });

      notifyToast('👑 VIP Tier Activated! +15% Yield Bonus & Instant UPI unlocked!', 'gold');
    } else {
      notifyToast(`VIP payment for ${sub?.userName || 'User'} approved.`, 'success');
    }
  }, [vipSubmissions, user, notifyToast]);

  const adminRejectVIP = useCallback((submissionId: string, reason: string) => {
    setVipSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          status: 'rejected',
          rejectionReason: reason,
          reviewedAt: new Date().toISOString()
        };
      }
      return s;
    }));

    const sub = vipSubmissions.find(s => s.id === submissionId);
    if (sub && sub.userId === user.id) {
      setUser(prev => ({
        ...prev,
        vipStatus: 'rejected',
      }));
    }

    notifyToast(`VIP submission rejected (${reason}).`, 'info');
  }, [vipSubmissions, user, notifyToast]);

  const adminUpdatePayoutStatus = useCallback((withdrawalId: string, status: PayoutStatus, txnRef?: string) => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id === withdrawalId) {
        return {
          ...w,
          status,
          processedAt: status === 'paid' ? new Date().toISOString() : w.processedAt,
          txnRef: txnRef || (status === 'paid' ? `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/CR` : w.txnRef)
        };
      }
      return w;
    }));

    notifyToast(`Withdrawal status updated to ${status.toUpperCase()}.`, 'success');
  }, [notifyToast]);

  const adminBatchApprovePayouts = useCallback((withdrawalIds: string[]) => {
    soundEngine.playCashSound();
    setWithdrawals(prev => prev.map(w => {
      if (withdrawalIds.includes(w.id)) {
        return {
          ...w,
          status: 'paid',
          processedAt: new Date().toISOString(),
          txnRef: `BATCH-UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`
        };
      }
      return w;
    }));

    notifyToast(`Batch approved ${withdrawalIds.length} payouts. Settlements dispatched!`, 'success');
  }, [notifyToast]);

  const adminUpdateEconomy = useCallback((newSettings: Partial<EconomySettings>) => {
    setEconomy(prev => ({ ...prev, ...newSettings }));
    notifyToast('Economy metrics updated in real-time.', 'success');
  }, [notifyToast]);

  const adminUpdatePaymentConfig = useCallback((newSettings: Partial<PaymentGatewayConfig>) => {
    setPaymentConfig(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('dataselling_payment_config', JSON.stringify(updated));
      return updated;
    });
    notifyToast('✅ Payment gateway & QR configuration updated!', 'success');
  }, [notifyToast]);

  const adminUpdateSupportConfig = useCallback((newSettings: Partial<SupportConfig>) => {
    setSupportConfig(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('dataselling_support_config', JSON.stringify(updated));
      return updated;
    });
    notifyToast('✅ Live support desk settings updated!', 'success');
  }, [notifyToast]);

  const adminAddAnnouncement = useCallback((item: Omit<SystemAnnouncement, 'id' | 'createdAt'>) => {
    const newAnn: SystemAnnouncement = {
      ...item,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    notifyToast('System announcement broadcasted!', 'success');
  }, [notifyToast]);

  const adminToggleAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  }, []);

  const adminDeleteAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    notifyToast('Announcement removed.', 'info');
  }, [notifyToast]);

  const exportPayoutsCSV = useCallback(() => {
    const headers = ['Request ID', 'User Name', 'Amount (INR)', 'Method', 'Payment Detail', 'Status', 'Requested Date', 'Txn Ref'];
    const rows = withdrawals.map(w => [
      w.id,
      `"${w.userName}"`,
      w.amount,
      w.method,
      `"${w.paymentDetail}"`,
      w.status,
      w.requestedAt,
      w.txnRef || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DataSelling_Payouts_Batch_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyToast('CSV exported for Bulk UPI processing.', 'success');
  }, [withdrawals, notifyToast]);

  const triggerAIAdvisor = useCallback(() => {
    setShowAIModal(true);
  }, []);

  // Authentication Handlers
  const login = useCallback((emailOrPhone: string, password: string) => {
    if (!emailOrPhone.trim() || !password.trim()) {
      notifyToast('Please enter both identifier (email/phone) and password.', 'error');
      return { success: false, message: 'Missing login credentials.' };
    }

    // Check stored user or accept login
    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      email: emailOrPhone.includes('@') ? emailOrPhone.trim() : prev.email,
      phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : prev.phone,
    }));
    setAuthModalOpen(false);
    soundEngine.playClick();
    notifyToast(`Welcome back, ${user.name}! Node session verified.`, 'success');
    return { success: true, message: 'Logged in successfully.' };
  }, [user.name, notifyToast]);

  const register = useCallback((data: { name: string; email: string; phone: string; password: string; upiId?: string; referralCode?: string }) => {
    if (!data.name.trim() || !data.email.trim() || !data.password.trim() || !data.phone.trim()) {
      notifyToast('Please fill out all required registration fields.', 'error');
      return { success: false, message: 'Missing fields.' };
    }

    const hasReferral = Boolean(data.referralCode && data.referralCode.trim().length > 3);
    const welcomeBonus = hasReferral ? 25.0 : 10.0;

    const newUser: UserProfile = {
      id: `usr-ds-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      upiId: data.upiId?.trim() || `${data.phone.trim()}@upi`,
      password: data.password,
      tier: 'standard',
      vipStatus: 'none',
      balanceINR: welcomeBonus,
      lifetimeEarningsINR: welcomeBonus,
      totalDataSharedMB: 0,
      sessionDataSharedMB: 0,
      isSharing: false,
      referralCode: `DS${Math.floor(1000 + Math.random() * 9000)}`,
      referredBy: hasReferral ? data.referralCode?.trim() : undefined,
      dailyStreak: 1,
      soundEnabled: true,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    setAuthModalOpen(false);

    if (hasReferral) {
      const bonusTx: TransactionRecord = {
        id: `tx-bonus-${Date.now()}`,
        type: 'referral_bonus',
        amountINR: welcomeBonus,
        timestamp: new Date().toISOString(),
        description: `Welcome Bonus (Invite Code: ${data.referralCode})`,
        status: 'completed',
      };
      setTransactions(prev => [bonusTx, ...prev]);
    }

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00FF87', '#D4AF37', '#FFFFFF'],
    });

    soundEngine.playVIPUnlock();
    notifyToast(`🎉 Welcome to Data Selling, ${newUser.name}! ₹${welcomeBonus.toFixed(2)} credited!`, 'gold');
    return { success: true, message: 'Account created successfully.' };
  }, [notifyToast]);

  const forgotPassword = useCallback((emailOrPhone: string, newPassword?: string) => {
    if (!emailOrPhone.trim()) {
      notifyToast('Please enter your registered Email or Mobile Number.', 'error');
      return { success: false, message: 'Please enter registered contact.' };
    }

    if (newPassword && newPassword.length >= 6) {
      setUser(prev => ({ ...prev, password: newPassword }));
      notifyToast('✅ Password updated successfully! Please sign in with your new password.', 'success');
      setAuthModalTab('login');
      return { success: true, message: 'Password reset successful.' };
    }

    notifyToast(`Verification code sent to ${emailOrPhone}. Use OTP 482910 to confirm.`, 'info');
    return { success: true, message: 'OTP sent.' };
  }, [notifyToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(prev => ({ ...prev, isSharing: false }));
    setActiveView('user');
    notifyToast('Logged out safely. Your bandwidth node has been disconnected.', 'info');
  }, [notifyToast]);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
    notifyToast('Profile settings updated successfully.', 'success');
  }, [notifyToast]);

  // Admin Master Password Verification
  const verifyAdminPassword = useCallback((password: string) => {
    if (password.trim() === ADMIN_MASTER_KEY) {
      setIsAdminUnlocked(true);
      setActiveView('admin');
      setAdminPasscodeModalOpen(false);
      soundEngine.playVIPUnlock();
      notifyToast('🛡️ SUPER ADMIN CLEARANCE GRANTED. Governance console unlocked.', 'gold');
      return true;
    } else {
      notifyToast('❌ Access Denied: Invalid Security Key.', 'error');
      return false;
    }
  }, [notifyToast]);

  const lockAdminPanel = useCallback(() => {
    setIsAdminUnlocked(false);
    setActiveView('user');
    notifyToast('Admin panel locked. Switched to user view.', 'info');
  }, [notifyToast]);

  return (
    <DataContext.Provider
      value={{
        user,
        economy,
        paymentConfig,
        supportConfig,
        vipSubmissions,
        withdrawals,
        referrals,
        transactions,
        announcements,
        telemetry,
        historyPoints,
        activeView,
        activeTab,
        setActiveView,
        setActiveTab,
        toggleDataSharing,
        quickSell,
        submitVIPPayment,
        submitActivationPayment,
        requestWithdrawal,
        adminApproveVIP,
        adminRejectVIP,
        adminUpdatePayoutStatus,
        adminBatchApprovePayouts,
        adminUpdateEconomy,
        adminUpdatePaymentConfig,
        adminUpdateSupportConfig,
        adminAddAnnouncement,
        adminToggleAnnouncement,
        adminDeleteAnnouncement,
        exportPayoutsCSV,
        toggleSound,
        triggerAIAdvisor,
        showAIModal,
        setShowAIModal,
        notifyToast,
        toast,
        selectedWithdrawalDetail,
        setSelectedWithdrawalDetail,
        isAuthenticated,
        authModalOpen,
        authModalTab,
        setAuthModalOpen,
        setAuthModalTab,
        userProfileModalOpen,
        setUserProfileModalOpen,
        login,
        register,
        forgotPassword,
        logout,
        updateProfile,
        adminPasscodeModalOpen,
        setAdminPasscodeModalOpen,
        isAdminUnlocked,
        verifyAdminPassword,
        lockAdminPanel,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
