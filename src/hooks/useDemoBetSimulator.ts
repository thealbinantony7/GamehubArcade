/**
 * DEMO BET SIMULATOR — Testing wallet lifecycle
 * Phase 11: Backend authority integration
 * Client NEVER computes outcomes
 */

import { useWalletStore } from '@/store/wallet.store';
import { useState, useRef } from 'react';
import { commitBet, resolveBet } from '@/services/backendAuthority';

const DEMO_GAMES = ['Dice', 'Crash', 'Plinko', 'Mines', 'Slots'];
const MIN_BET_INTERVAL_MS = 1200; // Authority rate limit

export type BetState = 'idle' | 'arming' | 'locked' | 'resolving' | 'resolved';

export function useDemoBetSimulator() {
    const { placeBet, resolveBet: applyResolution, isBettingBlocked, getBlockReason, getBetDelay } = useWalletStore();
    const [betState, setBetState] = useState<BetState>('idle');
    const [activeBets, setActiveBets] = useState<Set<number>>(new Set());
    const lastBetTime = useRef<number>(0);

    const simulateBet = async (amount: number = 10) => {
        // Authority rate limiting
        const now = Date.now();
        const timeSinceLastBet = now - lastBetTime.current;
        if (timeSinceLastBet < MIN_BET_INTERVAL_MS) {
            // Silent rejection
            return;
        }

        // Check if betting is blocked
        if (isBettingBlocked()) {
            console.warn('[Demo] Betting blocked:', getBlockReason());
            return;
        }

        if (betState !== 'idle') {
            console.warn('[Demo] Bet already in progress');
            return;
        }

        lastBetTime.current = now;

        // ARMING phase (commitment friction)
        setBetState('arming');
        await new Promise(resolve => setTimeout(resolve, 800));

        // LOCKED phase - commit bet to backend
        setBetState('locked');

        const game = DEMO_GAMES[Math.floor(Math.random() * DEMO_GAMES.length)];

        try {
            // Backend commitment (or simulated)
            const commitment = await commitBet(game, amount);

            // Place bet in local wallet (deduct balance)
            const betId = placeBet(game, amount);

            if (betId === null) {
                console.warn('[Demo] Bet placement failed');
                setBetState('idle');
                return;
            }

            setActiveBets(prev => new Set(prev).add(betId));

            // Apply fatigue delay
            const fatigueDelay = getBetDelay();
            if (fatigueDelay > 0) {
                await new Promise(resolve => setTimeout(resolve, fatigueDelay));
            }

            // RESOLVING phase - backend computes outcome
            setBetState('resolving');

            // Backend resolution (includes all temporal biases)
            const resolution = await resolveBet(commitment.commitmentId, game, amount);

            // Apply resolution to wallet (reconcile balance)
            applyResolution(betId, resolution.multiplier);

            setActiveBets(prev => {
                const next = new Set(prev);
                next.delete(betId);
                return next;
            });

            setBetState('resolved');

            // Return to idle
            setTimeout(() => setBetState('idle'), 500);

        } catch (error) {
            console.error('[Demo] Bet failed:', error);
            setBetState('idle');
            // Network failure = unresolved state
            // No retries without explicit resolve
        }
    };

    return {
        simulateBet,
        betState,
        activeBetsCount: activeBets.size,
    };
}
