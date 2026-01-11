/**
 * COMPLIANCE PAGE — Responsible Gambling Dashboard
 * Phase 14: Read-only view of risk controls and session data
 * Zero animations, zero state mutations, zero performance impact
 */

import { Link } from 'react-router-dom';
import { Shield, Clock, TrendingDown, Activity, ExternalLink } from 'lucide-react';
import { useWalletStore } from '@/store/wallet.store';
import AppShell from '@/components/layout/AppShell';

export default function Compliance() {
    const sessionLossLimit = useWalletStore(state => state.sessionLossLimit);
    const dailyLossLimit = useWalletStore(state => state.dailyLossLimit);
    const cooldownUntil = useWalletStore(state => state.cooldownUntil);
    const damageResidue = useWalletStore(state => state.damageResidue);
    const sessionCount = useWalletStore(state => state.sessionCount);
    const lastSessionEnd = useWalletStore(state => state.lastSessionEnd);
    const isBettingBlocked = useWalletStore(state => state.isBettingBlocked());
    const getBlockReason = useWalletStore(state => state.getBlockReason());

    const formatTimestamp = (timestamp: number | null) => {
        if (!timestamp) return 'Never';
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCooldownStatus = () => {
        if (!cooldownUntil) return 'Inactive';
        if (Date.now() >= cooldownUntil) return 'Expired';
        const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000 / 60);
        return `Active (${remaining}m remaining)`;
    };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Shield className="h-8 w-8 text-green-500" />
                        Responsible Gambling
                    </h1>
                    <p className="text-white/60">
                        View your current risk controls and session data. All limits are self-imposed and can be adjusted in the verification panel.
                    </p>
                </div>

                {/* Status Alert */}
                {isBettingBlocked && (
                    <div className="p-4 bg-brand-red-base/10 border border-brand-red-base/40 rounded-lg">
                        <div className="flex items-center gap-2 text-brand-red-base font-bold text-sm uppercase tracking-wider">
                            <Shield className="h-4 w-4" />
                            Betting Currently Blocked
                        </div>
                        <p className="text-white/80 text-sm mt-1">Reason: {getBlockReason()}</p>
                    </div>
                )}

                {/* Risk Controls */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">Active Risk Controls</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Session Loss Limit */}
                        <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-wider mb-2">
                                <TrendingDown className="h-3 w-3" />
                                Session Loss Limit
                            </div>
                            <div className="text-2xl font-bold text-white font-mono">
                                {sessionLossLimit !== null ? `$${sessionLossLimit.toFixed(2)}` : 'Not Set'}
                            </div>
                            <p className="text-xs text-white/40 mt-1">
                                {sessionLossLimit !== null ? 'Betting blocked when session loss reaches this amount' : 'No limit currently active'}
                            </p>
                        </div>

                        {/* Daily Loss Limit */}
                        <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-wider mb-2">
                                <TrendingDown className="h-3 w-3" />
                                Daily Loss Limit
                            </div>
                            <div className="text-2xl font-bold text-white font-mono">
                                {dailyLossLimit !== null ? `$${dailyLossLimit.toFixed(2)}` : 'Not Set'}
                            </div>
                            <p className="text-xs text-white/40 mt-1">
                                {dailyLossLimit !== null ? 'Betting blocked when daily loss reaches this amount' : 'No limit currently active'}
                            </p>
                        </div>

                        {/* Cooldown Status */}
                        <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-wider mb-2">
                                <Clock className="h-3 w-3" />
                                Cooldown Status
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {getCooldownStatus()}
                            </div>
                            <p className="text-xs text-white/40 mt-1">
                                Temporary betting pause for reflection
                            </p>
                        </div>

                        {/* Damage Residue */}
                        <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-wider mb-2">
                                <Activity className="h-3 w-3" />
                                Loss Memory Score
                            </div>
                            <div className="text-2xl font-bold text-white font-mono">
                                {damageResidue.toFixed(0)}
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                                <div
                                    className="bg-brand-red-base h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min((damageResidue / 1000) * 100, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-white/40 mt-1">
                                Cumulative loss memory (decays with wins)
                            </p>
                        </div>
                    </div>
                </section>

                {/* Session Data */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">Session Data</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-4">
                            <div className="text-white/70 text-xs uppercase tracking-wider mb-1">Total Sessions</div>
                            <div className="text-2xl font-bold text-white font-mono">{sessionCount}</div>
                        </div>

                        <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-4">
                            <div className="text-white/70 text-xs uppercase tracking-wider mb-1">Last Session Ended</div>
                            <div className="text-lg font-bold text-white">{formatTimestamp(lastSessionEnd)}</div>
                        </div>
                    </div>
                </section>

                {/* Configuration Link */}
                <section className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Configure Limits</h3>
                    <p className="text-white/60 text-sm mb-4">
                        Set or adjust your risk controls in the verification panel. Limits can only be lowered on the same day they are set.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-sm font-bold text-white uppercase tracking-wider transition-colors"
                    >
                        Open Verification Panel
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                </section>

                {/* Disclaimer */}
                <div className="text-xs text-white/40 text-center">
                    <p>All data is stored locally in your browser. No information is transmitted to external servers.</p>
                    <p className="mt-1">For help with problem gambling, visit <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white underline">BeGambleAware.org</a></p>
                </div>
            </div>
        </AppShell>
    );
}
