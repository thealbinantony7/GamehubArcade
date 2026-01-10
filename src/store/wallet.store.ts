/**
 * WALLET STORE — Stateful, reactive, auditable balance management
 * No hardcoded balances. All mutations deterministic.
 * Phase 8: Risk constraints and loss limits enforced.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BetRecord {
    id: number;
    timestamp: number;
    game: string;
    betAmount: number;
    multiplier: number;
    payout: number;
    balanceBefore: number;
    balanceAfter: number;
}

interface WalletState {
    balance: number;
    sessionStartBalance: number;
    sessionStartTime: number;
    dailyStartBalance: number;
    dailyStartDate: string; // YYYY-MM-DD
    lastUpdated: number;
    betHistory: BetRecord[];
    totalBetsPlaced: number;

    // Risk Constraints
    sessionLossLimit: number | null;
    dailyLossLimit: number | null;
    cooldownUntil: number | null;
    limitsSetDate: string | null; // Track when limits were last set

    // Session Exhaustion (Phase 9)
    sessionCount: number;
    lastSessionEnd: number | null;
    lastSessionLoss: number;
    lastSessionDuration: number;


    // Damage Memory (Phase 10/11)
    damageResidue: number; // Total cumulative loss memory
    residueAgeBuckets: {
        recent: number;  // Decays faster
        aged: number;    // Decays slower (10-20%)
    };
    residueLastUpdate: number; // Timestamp for aging calculation
}

interface WalletActions {
    placeBet: (game: string, amount: number) => number | null;
    resolveBet: (betId: number, multiplier: number) => void;
    resetSession: () => void;
    getSessionPnL: () => number;
    getSessionDuration: () => number;

    // Risk Management
    getSessionLoss: () => number;
    getDailyLoss: () => number;
    isBettingBlocked: () => boolean;
    getBlockReason: () => string | null;
    setSessionLossLimit: (limit: number | null) => void;
    setDailyLossLimit: (limit: number | null) => void;
    setCooldown: (minutes: number) => void;
    clearCooldown: () => void;
    getRemainingCooldown: () => number;

    // Session Exhaustion (Phase 9/11)
    getFatigueScore: () => number;
    endSession: () => Promise<void>; // Async for finality moment
    getBetDelay: () => number; // Returns delay in ms based on fatigue
}

type WalletStore = WalletState & WalletActions;

const INITIAL_BALANCE = 1000.00;

const getTodayDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const useWalletStore = create<WalletStore>()(
    persist(
        (set, get) => ({
            // State
            balance: INITIAL_BALANCE,
            sessionStartBalance: INITIAL_BALANCE,
            sessionStartTime: Date.now(),
            dailyStartBalance: INITIAL_BALANCE,
            dailyStartDate: getTodayDate(),
            lastUpdated: Date.now(),
            betHistory: [],
            totalBetsPlaced: 0,

            // Risk Constraints
            sessionLossLimit: null,
            dailyLossLimit: null,
            cooldownUntil: null,
            limitsSetDate: null,

            // Session Exhaustion
            sessionCount: 0,
            lastSessionEnd: null,
            lastSessionLoss: 0,
            lastSessionDuration: 0,

            // Damage Memory
            damageResidue: 0,
            residueAgeBuckets: {
                recent: 0,
                aged: 0,
            },
            residueLastUpdate: Date.now(),

            // Actions
            placeBet: (game: string, amount: number) => {
                const state = get();

                // Check if betting is blocked
                if (state.isBettingBlocked()) {
                    console.warn('[Wallet] Betting blocked:', state.getBlockReason());
                    return null;
                }

                // Validate sufficient funds
                if (state.balance < amount) {
                    console.warn('[Wallet] Insufficient funds for bet');
                    return null;
                }

                const betId = Date.now();
                const balanceBefore = state.balance;
                const balanceAfter = balanceBefore - amount;

                // Create pending bet record
                const betRecord: BetRecord = {
                    id: betId,
                    timestamp: Date.now(),
                    game,
                    betAmount: amount,
                    multiplier: 0, // Pending
                    payout: 0, // Pending
                    balanceBefore,
                    balanceAfter,
                };

                set({
                    balance: balanceAfter,
                    lastUpdated: Date.now(),
                    betHistory: [betRecord, ...state.betHistory].slice(0, 100),
                    totalBetsPlaced: state.totalBetsPlaced + 1,
                });

                return betId;
            },

            resolveBet: (betId: number, multiplier: number) => {
                const state = get();
                const betIndex = state.betHistory.findIndex(b => b.id === betId);

                if (betIndex === -1) {
                    console.warn('[Wallet] Bet not found:', betId);
                    return;
                }

                const bet = state.betHistory[betIndex];
                const payout = bet.betAmount * multiplier;
                const newBalance = state.balance + payout;

                // Update bet record
                const updatedBet: BetRecord = {
                    ...bet,
                    multiplier,
                    payout,
                    balanceAfter: newBalance,
                };

                const updatedHistory = [...state.betHistory];
                updatedHistory[betIndex] = updatedBet;

                set({
                    balance: newBalance,
                    lastUpdated: Date.now(),
                    betHistory: updatedHistory,
                });
            },

            resetSession: () => {
                const currentBalance = get().balance;
                set({
                    sessionStartBalance: currentBalance,
                    sessionStartTime: Date.now(),
                    betHistory: [],
                    totalBetsPlaced: 0,
                    lastUpdated: Date.now(),
                });
            },

            getSessionPnL: () => {
                const state = get();
                return state.balance - state.sessionStartBalance;
            },

            getSessionDuration: () => {
                const state = get();
                return Math.floor((Date.now() - state.sessionStartTime) / 1000);
            },

            // Risk Management
            getSessionLoss: () => {
                const state = get();
                const loss = state.sessionStartBalance - state.balance;
                return Math.max(0, loss);
            },

            getDailyLoss: () => {
                const state = get();
                const today = getTodayDate();

                // Reset daily tracking if new day
                if (state.dailyStartDate !== today) {
                    set({
                        dailyStartBalance: state.balance,
                        dailyStartDate: today,
                    });
                    return 0;
                }

                const loss = state.dailyStartBalance - state.balance;
                return Math.max(0, loss);
            },

            isBettingBlocked: () => {
                const state = get();

                // Check cooldown
                if (state.cooldownUntil && Date.now() < state.cooldownUntil) {
                    return true;
                }

                // Check session loss limit
                if (state.sessionLossLimit !== null && state.getSessionLoss() >= state.sessionLossLimit) {
                    return true;
                }

                // Check daily loss limit
                if (state.dailyLossLimit !== null && state.getDailyLoss() >= state.dailyLossLimit) {
                    return true;
                }

                return false;
            },

            getBlockReason: () => {
                const state = get();

                if (state.cooldownUntil && Date.now() < state.cooldownUntil) {
                    return 'COOLDOWN ACTIVE';
                }

                if (state.sessionLossLimit !== null && state.getSessionLoss() >= state.sessionLossLimit) {
                    return 'SESSION LIMIT REACHED';
                }

                if (state.dailyLossLimit !== null && state.getDailyLoss() >= state.dailyLossLimit) {
                    return 'DAILY LOSS LIMIT REACHED';
                }

                return null;
            },

            setSessionLossLimit: (limit: number | null) => {
                const state = get();
                const today = getTodayDate();

                // Can only lower limits on same day
                if (state.limitsSetDate === today && limit !== null && state.sessionLossLimit !== null && limit > state.sessionLossLimit) {
                    console.warn('[Wallet] Cannot increase limit on same day');
                    return;
                }

                set({
                    sessionLossLimit: limit,
                    limitsSetDate: today,
                });
            },

            setDailyLossLimit: (limit: number | null) => {
                const state = get();
                const today = getTodayDate();

                // Can only lower limits on same day
                if (state.limitsSetDate === today && limit !== null && state.dailyLossLimit !== null && limit > state.dailyLossLimit) {
                    console.warn('[Wallet] Cannot increase limit on same day');
                    return;
                }

                set({
                    dailyLossLimit: limit,
                    limitsSetDate: today,
                });
            },

            setCooldown: (minutes: number) => {
                set({
                    cooldownUntil: Date.now() + (minutes * 60 * 1000),
                });
            },

            clearCooldown: () => {
                set({
                    cooldownUntil: null,
                });
            },

            getRemainingCooldown: () => {
                const state = get();
                if (!state.cooldownUntil) return 0;
                const remaining = Math.max(0, state.cooldownUntil - Date.now());
                return Math.ceil(remaining / 1000);
            },

            // Session Exhaustion
            getFatigueScore: () => {
                const state = get();
                const sessionDuration = state.getSessionDuration();
                const sessionLoss = state.getSessionLoss();

                // Fatigue increases with:
                // - Session length (1 point per 10 minutes)
                // - Loss magnitude (1 point per $100 lost)
                // - Session count (0.5 points per session)
                const durationFatigue = sessionDuration / 600; // 10 minutes
                const lossFatigue = sessionLoss / 100;
                const countFatigue = state.sessionCount * 0.5;

                return durationFatigue + lossFatigue + countFatigue;
            },

            endSession: async () => {
                const state = get();
                const sessionLoss = state.getSessionLoss();
                const sessionDuration = state.getSessionDuration();
                const sessionPnL = state.getSessionPnL();
                const now = Date.now();

                // Session finality moment (Phase 11)
                // Brief global UI dim (150-250ms)
                if (typeof document !== 'undefined') {
                    const dimDuration = 150 + Math.random() * 100;
                    document.body.style.pointerEvents = 'none';
                    document.body.style.opacity = '0.7';

                    await new Promise(resolve => setTimeout(resolve, dimDuration));

                    document.body.style.pointerEvents = '';
                    document.body.style.opacity = '';
                }

                // Age recent residue into aged bucket (after 24 hours)
                const timeSinceUpdate = now - state.residueLastUpdate;
                const hoursElapsed = timeSinceUpdate / (1000 * 60 * 60);

                let newRecent = state.residueAgeBuckets.recent;
                let newAged = state.residueAgeBuckets.aged;

                if (hoursElapsed >= 24) {
                    // Move recent to aged
                    newAged += newRecent;
                    newRecent = 0;
                }

                // Update residue based on session outcome
                if (sessionPnL < 0) {
                    // Add new loss to recent bucket
                    newRecent += Math.abs(sessionPnL);
                } else if (sessionPnL > 0) {
                    // Decay: recent decays faster (50%), aged decays slower (15%)
                    const recentDecay = sessionPnL * 0.5;
                    const agedDecay = sessionPnL * 0.15;

                    newRecent = Math.max(0, newRecent - recentDecay);
                    newAged = Math.max(0, newAged - agedDecay);
                }

                const newDamageResidue = newRecent + newAged;

                set({
                    sessionCount: state.sessionCount + 1,
                    lastSessionEnd: now,
                    lastSessionLoss: sessionLoss,
                    lastSessionDuration: sessionDuration,
                    damageResidue: newDamageResidue,
                    residueAgeBuckets: {
                        recent: newRecent,
                        aged: newAged,
                    },
                    residueLastUpdate: now,
                });
            },

            getBetDelay: () => {
                const state = get();
                const fatigue = state.getFatigueScore();

                // Base delay: 0ms
                // Add 50ms per fatigue point (max 500ms additional)
                const fatigueDelay = Math.min(fatigue * 50, 500);
                return Math.floor(fatigueDelay);
            },
        }),
        {
            name: 'paradox-wallet',
            partialize: (state) => ({
                balance: state.balance,
                sessionStartBalance: state.sessionStartBalance,
                sessionStartTime: state.sessionStartTime,
                dailyStartBalance: state.dailyStartBalance,
                dailyStartDate: state.dailyStartDate,
                betHistory: state.betHistory,
                totalBetsPlaced: state.totalBetsPlaced,
                sessionLossLimit: state.sessionLossLimit,
                dailyLossLimit: state.dailyLossLimit,
                cooldownUntil: state.cooldownUntil,
                limitsSetDate: state.limitsSetDate,
                sessionCount: state.sessionCount,
                lastSessionEnd: state.lastSessionEnd,
                lastSessionLoss: state.lastSessionLoss,
                lastSessionDuration: state.lastSessionDuration,
                damageResidue: state.damageResidue,
                residueAgeBuckets: state.residueAgeBuckets,
                residueLastUpdate: state.residueLastUpdate,
            }),
        }
    )
);
