/**
 * RECENT BETS — Static table (no setInterval, no framer-motion)
 * Phase 13 INP Fix: All live updates removed for performance.
 */

import { Dices, TrendingUp, CircleDot, Bomb, Gamepad2 } from 'lucide-react';

const GAMES = [
    { name: 'Crash', icon: TrendingUp },
    { name: 'Dice', icon: Dices },
    { name: 'Mines', icon: Bomb },
    { name: 'Plinko', icon: CircleDot },
    { name: 'Slots', icon: Gamepad2 }
];

// Static bet data (no live updates)
const STATIC_BETS = [
    { id: 1, game: 'Crash', icon: TrendingUp, bet: 150, multiplier: 2.5, win: true, payout: 375 },
    { id: 2, game: 'Dice', icon: Dices, bet: 50, multiplier: 1.8, win: true, payout: 90 },
    { id: 3, game: 'Mines', icon: Bomb, bet: 200, multiplier: 0, win: false, payout: 0 },
    { id: 4, game: 'Plinko', icon: CircleDot, bet: 75, multiplier: 3.2, win: true, payout: 240 },
    { id: 5, game: 'Slots', icon: Gamepad2, bet: 100, multiplier: 0, win: false, payout: 0 },
    { id: 6, game: 'Crash', icon: TrendingUp, bet: 80, multiplier: 4.1, win: true, payout: 328 },
    { id: 7, game: 'Dice', icon: Dices, bet: 120, multiplier: 0, win: false, payout: 0 },
    { id: 8, game: 'Mines', icon: Bomb, bet: 60, multiplier: 2.0, win: true, payout: 120 },
];

export default function RecentBets() {
    return (
        <div className="bg-[hsl(220,18%,11%)] w-full text-left border-collapse">
            {/* Header */}
            <div className="grid grid-cols-4 px-6 py-3 border-b border-white/5 bg-black/20 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div>Game</div>
                <div>Bet</div>
                <div>Mult</div>
                <div className="text-right">Payout</div>
            </div>

            {/* Rows (Static, no animation) */}
            <div className="relative">
                {STATIC_BETS.map((bet) => (
                    <div
                        key={bet.id}
                        className="grid grid-cols-4 px-6 py-3 border-b border-white/5 text-sm items-center hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-md bg-white/5 text-white/60">
                                <bet.icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-white/90 hidden md:block">{bet.game}</span>
                        </div>

                        <div className="text-white/80 font-mono tabular-nums">
                            ${bet.bet.toFixed(2)}
                        </div>

                        <div className={bet.win ? "text-[hsl(145,70%,45%)] font-bold" : "text-white/70"}>
                            {bet.multiplier.toFixed(2)}x
                        </div>

                        <div className={`text-right font-bold font-mono tabular-nums ${bet.win ? "text-[hsl(145,70%,45%)]" : "text-white/70"}`}>
                            {bet.payout > 0 ? `+$${bet.payout.toFixed(2)}` : '0.00'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
