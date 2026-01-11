/**
 * GAME SIDEBAR — Bet Controls & Info
 * Phase 18: Stake-style sidebar
 */

import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useWalletStore } from '@/store/wallet.store';

interface GameSidebarProps {
    betAmount: number;
    onBetAmountChange: (amount: number) => void;
    onDrop: () => void;
    isPlaying: boolean;
    disabled: boolean;
    rtp: number;
    rows: number;
    maxMultiplier: number;
    serverSeedHash: string;
    clientSeed: string;
    onClientSeedChange: (seed: string) => void;
    nonce: number;
}

export default function GameSidebar({
    betAmount,
    onBetAmountChange,
    onDrop,
    isPlaying,
    disabled,
    rtp,
    rows,
    maxMultiplier,
    serverSeedHash,
    clientSeed,
    onClientSeedChange,
    nonce,
}: GameSidebarProps) {
    const balance = useWalletStore(state => state.balance);
    const sessionPnL = useWalletStore(state => state.getSessionPnL());
    const totalBetsPlaced = useWalletStore(state => state.totalBetsPlaced);
    const [fairnessExpanded, setFairnessExpanded] = useState(false);

    return (
        <div className="w-80 bg-[#0f0f0f] border-l border-white/5 flex flex-col">
            {/* Bet Controls */}
            <div className="p-4 border-b border-white/5">
                <div className="mb-3">
                    <label className="block text-xs text-white/40 mb-2">Bet Amount</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => onBetAmountChange(Number(e.target.value))}
                            min="1"
                            max={balance}
                            disabled={isPlaying}
                            className="flex-1 bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-green-500/50"
                            aria-label="Bet amount"
                        />
                        <button
                            onClick={() => onBetAmountChange(betAmount / 2)}
                            disabled={isPlaying}
                            className="px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded text-white/60 hover:text-white text-xs disabled:opacity-50"
                        >
                            ½
                        </button>
                        <button
                            onClick={() => onBetAmountChange(Math.min(betAmount * 2, balance))}
                            disabled={isPlaying}
                            className="px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded text-white/60 hover:text-white text-xs disabled:opacity-50"
                        >
                            2×
                        </button>
                    </div>
                </div>

                <button
                    onClick={onDrop}
                    disabled={disabled || isPlaying}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-white/10 disabled:text-white/40 text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                    aria-label="Drop ball"
                >
                    <Play className="h-4 w-4" />
                    Drop Ball
                </button>

                <div className="mt-2 text-xs text-white/40 text-center">
                    Press <kbd className="px-1 py-0.5 bg-white/10 rounded">Space</kbd> to drop
                </div>
            </div>

            {/* Game Stats */}
            <div className="p-4 border-b border-white/5">
                <h3 className="text-xs font-bold text-white/60 mb-3">Game Stats</h3>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-white/40">RTP:</span>
                        <span className="text-white font-mono">{rtp.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/40">Rows:</span>
                        <span className="text-white">{rows}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/40">Max Multiplier:</span>
                        <span className="text-white">{maxMultiplier}x</span>
                    </div>
                </div>
            </div>

            {/* Provably Fair */}
            <div className="p-4 border-b border-white/5">
                <button
                    onClick={() => setFairnessExpanded(!fairnessExpanded)}
                    className="w-full flex items-center justify-between text-xs font-bold text-white/60 hover:text-white transition-colors"
                >
                    <span>Provably Fair</span>
                    {fairnessExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {fairnessExpanded && (
                    <div className="mt-3 space-y-2 text-xs">
                        <div>
                            <div className="text-white/40 mb-1">Server Seed (Hashed)</div>
                            <div className="font-mono text-white/60 break-all text-[10px] bg-[#1a1a1a] p-2 rounded">
                                {serverSeedHash.substring(0, 32)}...
                            </div>
                        </div>
                        <div>
                            <div className="text-white/40 mb-1">Client Seed</div>
                            <input
                                type="text"
                                value={clientSeed}
                                onChange={(e) => onClientSeedChange(e.target.value)}
                                disabled={isPlaying}
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded px-2 py-1 text-white/80 font-mono text-[10px] focus:outline-none focus:border-green-500/50"
                                aria-label="Client seed"
                            />
                        </div>
                        <div>
                            <div className="text-white/40 mb-1">Nonce</div>
                            <div className="font-mono text-white">{nonce}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Session Info */}
            <div className="p-4 flex-1">
                <h3 className="text-xs font-bold text-white/60 mb-3">Session</h3>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-white/40">Bets:</span>
                        <span className="text-white">{totalBetsPlaced}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/40">P&L:</span>
                        <span className={sessionPnL >= 0 ? 'text-green-500 font-mono' : 'text-white font-mono'}>
                            {sessionPnL >= 0 ? '+' : ''}${sessionPnL.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Feature Slots (Disabled) */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <button disabled className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded text-white/20 text-xs cursor-not-allowed">
                    Autobet (Available later)
                </button>
                <button disabled className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded text-white/20 text-xs cursor-not-allowed">
                    Fast Mode (Available later)
                </button>
            </div>
        </div>
    );
}
