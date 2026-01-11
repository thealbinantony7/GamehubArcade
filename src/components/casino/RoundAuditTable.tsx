/**
 * ROUND AUDIT TABLE — Static ledger (no framer-motion)
 * Phase 13 INP Fix: All animations removed for performance.
 */

import { Dices, TrendingUp, CircleDot, Bomb, Gamepad2, ExternalLink } from 'lucide-react';
import { useWalletStore } from '@/store/wallet.store';

const GAME_ICONS: Record<string, any> = {
    'Crash': TrendingUp,
    'Dice': Dices,
    'Mines': Bomb,
    'Plinko': CircleDot,
    'Slots': Gamepad2,
};

export default function RoundAuditTable() {
    const betHistory = useWalletStore(state => state.betHistory);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Audit Log</h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono tabular-nums">{betHistory.length} rounds</span>
                    <span className="text-[10px] text-white/20 uppercase tracking-wider px-2 py-0.5 bg-white/5 rounded">DEMO LEDGER</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-brand-obsidian-glass/40 backdrop-blur-glass border border-brand-obsidian-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3 text-slate-400 font-medium uppercase tracking-wider">Round ID</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium uppercase tracking-wider">Game</th>
                                <th className="text-right px-4 py-3 text-slate-400 font-medium uppercase tracking-wider">Bet</th>
                                <th className="text-right px-4 py-3 text-slate-400 font-medium uppercase tracking-wider">Multiplier</th>
                                <th className="text-right px-4 py-3 text-slate-400 font-medium uppercase tracking-wider">Payout</th>
                                <th className="text-right px-4 py-3 text-slate-400 font-medium uppercase tracking-wider">Hash</th>
                            </tr>
                        </thead>
                        <tbody>
                            {betHistory.map((bet) => {
                                const Icon = GAME_ICONS[bet.game] || Dices;
                                const win = bet.payout > 0;
                                const hash = bet.id.toString(16).slice(-8) + '...';

                                return (
                                    <tr
                                        key={bet.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-white/60 tabular-nums">#{bet.id}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-3 h-3 text-slate-400" />
                                                <span className="text-white/80">{bet.game}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-white/80 font-mono tabular-nums">
                                                ${bet.betAmount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`font-mono font-bold tabular-nums ${win ? 'text-green-500' : 'text-slate-400'
                                                }`}>
                                                {bet.multiplier > 0 ? `${bet.multiplier.toFixed(2)}x` : 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`font-mono tabular-nums ${win ? 'text-green-500' : 'text-slate-400'
                                                }`}>
                                                ${bet.payout.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="font-mono text-white/20 text-[10px] hidden sm:inline-block">
                                                    {hash}
                                                </span>
                                                <button className="text-slate-400 hover:text-white transition-colors" aria-label="View hash details">
                                                    <ExternalLink className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
