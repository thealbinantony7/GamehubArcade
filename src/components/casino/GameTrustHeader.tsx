/**
 * GAME TRUST HEADER — RTP & House Edge Display
 * Always visible. No tooltips. No hiding.
 * Phase 8: Risk strip with loss tracking.
 */

import { memo } from 'react';
import ProvablyFairBadge from './ProvablyFairBadge';
import { useWalletStore } from '@/store/wallet.store';

interface GameTrustHeaderProps {
    gameName: string;
    rtp: number;
    houseEdge: number;
    onVerifyClick?: () => void;
}

function GameTrustHeader({ gameName, rtp, houseEdge, onVerifyClick }: GameTrustHeaderProps) {
    const sessionPnL = useWalletStore(state => state.getSessionPnL());
    const totalBets = useWalletStore(state => state.totalBetsPlaced);
    const sessionLoss = useWalletStore(state => state.getSessionLoss());
    const sessionLossLimit = useWalletStore(state => state.sessionLossLimit);
    const isBettingBlocked = useWalletStore(state => state.isBettingBlocked());
    const blockReason = useWalletStore(state => state.getBlockReason());
    const getRemainingCooldown = useWalletStore(state => state.getRemainingCooldown);

    const remainingAllowance = sessionLossLimit !== null ? sessionLossLimit - sessionLoss : null;

    return (
        <div className="bg-brand-obsidian-glass/40 backdrop-blur-glass border-b border-brand-obsidian-border">
            {/* Main Header */}
            <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-white uppercase tracking-tight">{gameName}</h1>
                    <ProvablyFairBadge onClick={onVerifyClick} />
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                        <span className="text-white/40 uppercase tracking-wide">AUTHORITY:</span>
                        <span className="text-white font-bold tabular-nums">SIMULATED</span>
                    </div>
                    <span className="text-white/20">|</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-white/40 uppercase tracking-wide">RTP:</span>
                        <span className="text-white font-bold tabular-nums">{rtp.toFixed(2)}%</span>
                    </div>
                    <span className="text-white/20">|</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-white/40 uppercase tracking-wide">HOUSE EDGE:</span>
                        <span className="text-white font-bold tabular-nums">{houseEdge.toFixed(2)}%</span>
                    </div>
                    <span className="text-white/20 hidden md:inline">|</span>
                    <div className="hidden md:flex items-center gap-1.5">
                        <span className="text-white/40 uppercase tracking-wide">SESSION:</span>
                        <span className={`font-bold tabular-nums ${sessionPnL > 0 ? 'text-green-500' : sessionPnL < 0 ? 'text-red-400' : 'text-white/60'
                            }`}>
                            {sessionPnL > 0 ? '+' : ''}{sessionPnL.toFixed(2)}
                        </span>
                    </div>
                    <span className="text-white/20 hidden lg:inline">|</span>
                    <div className="hidden lg:flex items-center gap-1.5">
                        <span className="text-white/40 uppercase tracking-wide">BETS:</span>
                        <span className="text-white/60 font-bold tabular-nums">{totalBets}</span>
                    </div>
                </div>
            </div>

            {/* Risk Strip */}
            {(isBettingBlocked || sessionLossLimit !== null) && (
                <div className="hidden md:flex items-center gap-4 px-6 py-2 bg-black/20 border-t border-white/5 text-xs font-mono">
                    {isBettingBlocked ? (
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-red-base" />
                            <span className="text-brand-red-base font-bold uppercase tracking-wider">
                                {blockReason === 'COOLDOWN ACTIVE'
                                    ? `COOLDOWN • ${Math.floor(getRemainingCooldown() / 60)}:${String(getRemainingCooldown() % 60).padStart(2, '0')}`
                                    : blockReason}
                            </span>
                        </div>
                    ) : sessionLossLimit !== null && (
                        <>
                            <div className="flex items-center gap-1.5">
                                <span className="text-white/40 uppercase">SESSION LOSS:</span>
                                <span className="text-white font-bold tabular-nums">-${sessionLoss.toFixed(2)}</span>
                            </div>
                            <span className="text-white/40">|</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-white/40 uppercase">REMAINING:</span>
                                <span className={`font-bold tabular-nums ${remainingAllowance !== null && remainingAllowance < 50 ? 'text-brand-red-base' : 'text-white'
                                    }`}>
                                    ${remainingAllowance?.toFixed(2) || '0.00'}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default memo(GameTrustHeader);
