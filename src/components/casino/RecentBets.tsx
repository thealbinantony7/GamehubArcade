/**
 * RECENT BETS — Live-looking table
 * Makes site feel active
 */

import { Dices, TrendingUp, CircleDot, Bomb } from 'lucide-react';

const FAKE_BETS = [
    { game: 'Crash', icon: TrendingUp, bet: 50.00, multiplier: 2.45, payout: 122.50, win: true },
    { game: 'Dice', icon: Dices, bet: 25.00, multiplier: 1.98, payout: 49.50, win: true },
    { game: 'Mines', icon: Bomb, bet: 100.00, multiplier: 0, payout: 0, win: false },
    { game: 'Plinko', icon: CircleDot, bet: 10.00, multiplier: 5.2, payout: 52.00, win: true },
    { game: 'Crash', icon: TrendingUp, bet: 75.00, multiplier: 1.5, payout: 112.50, win: true },
];

export default function RecentBets() {
    return (
        <div className="bg-[hsl(220,18%,11%)] rounded-xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-base font-semibold text-white">Recent Bets</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Game
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Bet
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Multiplier
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Payout
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {FAKE_BETS.map((bet, i) => {
                            const Icon = bet.icon;
                            return (
                                <tr key={`${bet.game}-${i}`} className="border-b border-white/5 hover:bg-white/5 transition-colors animate-fade-in">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4 text-white/60" />
                                            <span className="text-sm text-white">{bet.game}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-white/80">
                                        ${bet.bet.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`text-sm font-semibold ${bet.win ? 'text-[hsl(145,70%,45%)]' : 'text-white/40'}`}>
                                            {bet.multiplier > 0 ? `${bet.multiplier}x` : '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`text-sm font-semibold ${bet.win ? 'text-[hsl(145,70%,45%)]' : 'text-white/40'}`}>
                                            {bet.payout > 0 ? `$${bet.payout.toFixed(2)}` : '$0.00'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
