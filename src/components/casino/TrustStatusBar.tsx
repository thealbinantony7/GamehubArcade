/**
 * TRUST STATUS BAR — Global Fairness Footer
 * Always visible. No animations except LIVE pulse.
 * Phase 8: Risk indicators and betting lock status.
 */

import { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useWalletStore } from '@/store/wallet.store';

interface TrustStatusBarProps {
    onVerifyClick: () => void;
}

function TrustStatusBar({ onVerifyClick }: TrustStatusBarProps) {
    const isBettingBlocked = useWalletStore(state => state.isBettingBlocked());
    const blockReason = useWalletStore(state => state.getBlockReason());
    const sessionLoss = useWalletStore(state => state.getSessionLoss());
    const sessionLossLimit = useWalletStore(state => state.sessionLossLimit);
    const getRemainingCooldown = useWalletStore(state => state.getRemainingCooldown);

    const [cooldownSeconds, setCooldownSeconds] = useState(0);

    // Mock data
    const rtp = 98.50;
    const currentHash = "0xABCD1234";
    const isLive = true;

    // Update cooldown countdown
    useEffect(() => {
        if (!isBettingBlocked || blockReason !== 'COOLDOWN ACTIVE') return;

        const interval = setInterval(() => {
            const remaining = getRemainingCooldown();
            setCooldownSeconds(remaining);
            if (remaining === 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isBettingBlocked, blockReason, getRemainingCooldown]);

    const formatCooldown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 lg:right-auto lg:left-[260px] h-8 bg-brand-obsidian-glass backdrop-blur-glass border-t border-brand-obsidian-border z-[var(--z-trust-bar)] lg:bottom-0">
            <div className="h-full px-4 flex items-center justify-between gap-4 text-xs font-mono">
                {/* LEFT: Status */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full bg-green-500",
                            isLive && "animate-pulse"
                        )} />
                        <span className="text-white/60 uppercase tracking-wider">LIVE</span>
                    </div>

                    <span className="text-slate-400">•</span>
                    <span className="text-white/90 uppercase tracking-wide">FAIR • VERIFIED</span>
                </div>

                {/* Damage Residue Ticks */}
                <DamageResidueTicks />
            </div>

            {/* CENTER: Metrics or Lock Status */}
            <div className="hidden md:flex items-center gap-3">
                {isBettingBlocked ? (
                    <>
                        <span className="text-brand-red-base font-bold uppercase tracking-wider">
                            {blockReason === 'COOLDOWN ACTIVE' ? `COOLDOWN • ${formatCooldown(cooldownSeconds)}` : blockReason}
                        </span>
                    </>
                ) : (
                    <>
                        {sessionLossLimit !== null && (
                            <>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-400 uppercase">SESSION LOSS:</span>
                                    <span className="text-white font-bold tabular-nums">
                                        -${sessionLoss.toFixed(2)} / ${sessionLossLimit.toFixed(2)}
                                    </span>
                                </div>
                                <span className="text-slate-400">•</span>
                            </>
                        )}
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 uppercase">RTP:</span>
                            <span className="text-white font-bold tabular-nums">{rtp.toFixed(2)}%</span>
                        </div>
                        <span className="text-slate-400">•</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 uppercase">HASH:</span>
                            <span className="text-white/60 tabular-nums">{currentHash}</span>
                        </div>
                    </>
                )}
            </div>

            {/* RIGHT: Verify Button */}
            <button
                onClick={onVerifyClick}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white/90 uppercase tracking-wider transition-colors active:scale-95"
            >
                VERIFY
            </button>
        </div>
    );
}

function DamageResidueTicks() {
    const damageResidue = useWalletStore(state => state.damageResidue);
    const tickCount = Math.floor(damageResidue / 100);

    if (tickCount === 0) return null;

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: Math.min(tickCount, 10) }).map((_, i) => (
                <div
                    key={i}
                    className="w-[2px] h-3 bg-brand-red-base/60"
                />
            ))}
        </div>
    );
}

export default memo(TrustStatusBar);
