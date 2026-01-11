/**
 * VERIFY DRAWER — Right slide-in verification panel
 * No modal. No bounce. Glass panel only.
 * Phase 8: Risk limits configuration added.
 * Phase 14: Audit log export added.
 */

import { memo, useState } from 'react';
import { X, Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletStore } from '@/store/wallet.store';

interface SeedData {
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
    previousServerSeed: string;
    previousClientSeed: string;
    previousNonce: number;
    previousResult: string;
}

interface VerifyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data?: SeedData;
}

function VerifyDrawer({ isOpen, onClose, data }: VerifyDrawerProps) {
    const currentRound = {
        serverSeedHash: data?.serverSeedHash || "0x7f9a...e0f1a (SIMULATED)",
        clientSeed: data?.clientSeed || "player_seed_abc123 (SIMULATED)",
        nonce: data?.nonce ?? 42,
    };

    const previousRound = {
        serverSeed: data?.previousServerSeed || "revealed_server_seed_xyz789 (SIMULATED)",
        clientSeed: data?.previousClientSeed || "player_seed_def456 (SIMULATED)",
        nonce: data?.previousNonce ?? 41,
        result: data?.previousResult || "0x3a4b...b4b (SIMULATED)",
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const exportAuditLog = () => {
        const betHistory = useWalletStore.getState().betHistory;

        // CSV header
        const header = 'Timestamp,Game,Bet Amount,Multiplier,Payout,Balance Before,Balance After\n';

        // CSV rows
        const rows = betHistory.map(bet => {
            const timestamp = new Date(bet.timestamp).toISOString();
            return `${timestamp},${bet.game},${bet.betAmount.toFixed(2)},${bet.multiplier.toFixed(2)},${bet.payout.toFixed(2)},${bet.balanceBefore.toFixed(2)},${bet.balanceAfter.toFixed(2)}`;
        }).join('\n');

        const csv = header + rows;

        // Generate filename with current timestamp
        const now = new Date();
        const filename = `gamehub_audit_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}.csv`;

        // Trigger download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[var(--z-verify-drawer)]"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-brand-obsidian-glass backdrop-blur-glass-heavy border-l border-brand-obsidian-border z-[var(--z-verify-drawer)] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-brand-obsidian-base/80 backdrop-blur-glass border-b border-brand-obsidian-border px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Verification</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <section>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">Current Round</h3>
                                <div className="space-y-3">
                                    <DataRow label="Server Seed (Hashed)" value={currentRound.serverSeedHash} onCopy={() => copyToClipboard(currentRound.serverSeedHash)} />
                                    <DataRow label="Client Seed" value={currentRound.clientSeed} onCopy={() => copyToClipboard(currentRound.clientSeed)} />
                                    <DataRow label="Nonce" value={currentRound.nonce.toString()} onCopy={() => copyToClipboard(currentRound.nonce.toString())} />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">Previous Round</h3>
                                <div className="space-y-3">
                                    <DataRow label="Server Seed (Revealed)" value={previousRound.serverSeed} onCopy={() => copyToClipboard(previousRound.serverSeed)} />
                                    <DataRow label="Client Seed" value={previousRound.clientSeed} onCopy={() => copyToClipboard(previousRound.clientSeed)} />
                                    <DataRow label="Nonce" value={previousRound.nonce.toString()} onCopy={() => copyToClipboard(previousRound.nonce.toString())} />
                                    <DataRow label="Result Hash" value={previousRound.result} onCopy={() => copyToClipboard(previousRound.result)} />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">How It Works</h3>
                                <ol className="space-y-2 text-xs text-white/70 font-mono">
                                    <li className="flex gap-2"><span className="text-white/40">1.</span><span>Server commits hash</span></li>
                                    <li className="flex gap-2"><span className="text-white/40">2.</span><span>Player contributes seed</span></li>
                                    <li className="flex gap-2"><span className="text-white/40">3.</span><span>Result = deterministic hash</span></li>
                                </ol>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">External Verification</h3>
                                <a href="#" className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-white/90 uppercase tracking-wider transition-colors">
                                    Verify Externally
                                </a>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">Audit Export</h3>
                                <button
                                    onClick={exportAuditLog}
                                    aria-label="Export audit log as CSV"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-white/90 uppercase tracking-wider transition-colors"
                                >
                                    <Download className="w-3 h-3" />
                                    Export CSV
                                </button>
                                <p className="text-xs text-white/40 mt-2">Download complete bet history for external verification</p>
                            </section>

                            <SessionHistorySection />
                            <RiskLimitsSection />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function DataRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
    return (
        <div className="bg-black/20 border border-white/5 rounded p-3">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
                <button onClick={onCopy} className="p-1 text-slate-400 hover:text-white transition-colors" title="Copy">
                    <Copy className="w-3 h-3" />
                </button>
            </div>
            <p className="text-xs font-mono text-white/80 break-all tabular-nums">{value}</p>
        </div>
    );
}

function RiskLimitsSection() {
    const sessionLossLimit = useWalletStore(state => state.sessionLossLimit);
    const dailyLossLimit = useWalletStore(state => state.dailyLossLimit);
    const setSessionLossLimit = useWalletStore(state => state.setSessionLossLimit);
    const setDailyLossLimit = useWalletStore(state => state.setDailyLossLimit);
    const setCooldown = useWalletStore(state => state.setCooldown);

    const [sessionLimit, setSessionLimit] = useState(sessionLossLimit?.toString() || '');
    const [dailyLimit, setDailyLimit] = useState(dailyLossLimit?.toString() || '');

    const handleSave = () => {
        if (sessionLimit) {
            setSessionLossLimit(parseFloat(sessionLimit));
        }
        if (dailyLimit) {
            setDailyLossLimit(parseFloat(dailyLimit));
        }
    };

    return (
        <section className="border-t border-brand-red-base/20 pt-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">Risk Limits</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Session Loss Limit</label>
                    <input
                        type="number"
                        value={sessionLimit}
                        onChange={(e) => setSessionLimit(e.target.value)}
                        placeholder="No limit"
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-sm text-white font-mono tabular-nums focus:outline-none focus:border-white/20"
                    />
                </div>

                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Daily Loss Limit</label>
                    <input
                        type="number"
                        value={dailyLimit}
                        onChange={(e) => setDailyLimit(e.target.value)}
                        placeholder="No limit"
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-sm text-white font-mono tabular-nums focus:outline-none focus:border-white/20"
                    />
                </div>

                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Cooldown Duration</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setCooldown(15)} className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-white/90 uppercase transition-colors">15m</button>
                        <button onClick={() => setCooldown(30)} className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-white/90 uppercase transition-colors">30m</button>
                        <button onClick={() => setCooldown(60)} className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-white/90 uppercase transition-colors">1h</button>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full px-4 py-3 bg-brand-red-base hover:bg-brand-red-deep border border-brand-red-base rounded text-sm font-bold text-white uppercase tracking-wider transition-colors active:scale-95"
                >
                    SET LIMITS
                </button>

                <p className="text-[10px] text-white/30 font-mono">
                    Limits can only be lowered on the same day. (SIMULATED)
                </p>
            </div>
        </section>
    );
}

function SessionHistorySection() {
    const sessionStartTime = useWalletStore(state => state.sessionStartTime);
    const lastSessionEnd = useWalletStore(state => state.lastSessionEnd);
    const lastSessionLoss = useWalletStore(state => state.lastSessionLoss);
    const lastSessionDuration = useWalletStore(state => state.lastSessionDuration);
    const sessionCount = useWalletStore(state => state.sessionCount);
    const getSessionPnL = useWalletStore(state => state.getSessionPnL());

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <section className="border-t border-white/10 pt-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">Session History</h3>

            <div className="space-y-3">
                {/* Current Session */}
                <div className="bg-black/20 border border-white/5 rounded p-3">
                    <div className="text-xs text-white/40 uppercase tracking-wide mb-2">Current Session</div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                            <span className="text-white/40">Start:</span>
                            <span className="text-white ml-2 tabular-nums">{formatTimestamp(sessionStartTime)}</span>
                        </div>
                        <div>
                            <span className="text-white/40">Net PnL:</span>
                            <span className={`ml-2 tabular-nums ${getSessionPnL > 0 ? 'text-green-500' : getSessionPnL < 0 ? 'text-red-400' : 'text-white'
                                }`}>
                                {getSessionPnL > 0 ? '+' : ''}{getSessionPnL.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Last Session */}
                {lastSessionEnd && (
                    <div className="bg-black/20 border border-white/5 rounded p-3">
                        <div className="text-xs text-white/40 uppercase tracking-wide mb-2">Last Session</div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div>
                                <span className="text-white/40">Ended:</span>
                                <span className="text-white ml-2 tabular-nums">{formatTimestamp(lastSessionEnd)}</span>
                            </div>
                            <div>
                                <span className="text-white/40">Duration:</span>
                                <span className="text-white ml-2 tabular-nums">{formatDuration(lastSessionDuration)}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-white/40">Loss:</span>
                                <span className="text-red-400 ml-2 tabular-nums">-${lastSessionLoss.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Session Count */}
                <div className="text-xs text-white/40 font-mono">
                    Total Sessions: <span className="text-white tabular-nums">{sessionCount}</span>
                </div>
            </div>
        </section>
    );
}

export default memo(VerifyDrawer);
