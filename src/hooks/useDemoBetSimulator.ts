/**
 * DEMO BET SIMULATOR — Testing wallet lifecycle
 * Simulates bet placement and resolution for demo purposes
 * Phase 8: Respects betting blocks and limits.
 */

import { useWalletStore } from '@/store/wallet.store';
import { useState } from 'react';

const DEMO_GAMES = ['Dice', 'Crash', 'Plinko', 'Mines', 'Slots'];

export function useDemoBetSimulator() {
    const { placeBet, resolveBet, isBettingBlocked, getBlockReason } = useWalletStore();
    const [activeBets, setActiveBets] = useState<Set<number>>(new Set());

    const simulateBet = (amount: number = 10) => {
        // Check if betting is blocked
        if (isBettingBlocked()) {
            console.warn('[Demo] Betting blocked:', getBlockReason());
            return;
        }

        const game = DEMO_GAMES[Math.floor(Math.random() * DEMO_GAMES.length)];
        const betId = placeBet(game, amount);

        if (betId === null) {
            console.warn('[Demo] Bet placement failed');
            return;
        }

        setActiveBets(prev => new Set(prev).add(betId));

        // Simulate game resolution after 2-4 seconds
        const delay = 2000 + Math.random() * 2000;
        setTimeout(() => {
            // 55% chance to win
            const win = Math.random() > 0.45;
            const multiplier = win ? 0.5 + Math.random() * 3 : 0; // 0.5x to 3.5x on win

            resolveBet(betId, multiplier);
            setActiveBets(prev => {
                const next = new Set(prev);
                next.delete(betId);
                return next;
            });
        }, delay);
    };

    return {
        simulateBet,
        activeBetsCount: activeBets.size,
    };
}
