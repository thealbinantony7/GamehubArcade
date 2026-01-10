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
    getRemainingCooldown: () => number; // seconds
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
            }),
        }
    )
);
